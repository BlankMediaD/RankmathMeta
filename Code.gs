/**
 * @OnlyCurrentDoc
 */

// Global variables for WordPress site URL, application password, and username.
// IMPORTANT: Replace placeholder values with your actual WordPress site details.
var WORDPRESS_URL = "YOUR_SITE_URL";
var APPLICATION_PASSWORD = "YOUR_APPLICATION_PASSWORD";
var WORDPRESS_USERNAME = "YOUR_WORDPRESS_USERNAME";

/**
 * Adds a custom menu to the Google Sheet UI when the spreadsheet is opened.
 */
function onOpen() {
  SpreadsheetApp.getUi()
      .createMenu('RankMath Updater')
      .addItem('Process Sheet', 'processSheet')
      .addToUi();
}

/**
 * Processes the data in the active sheet.
 * Extracts Post ID, Title, and Description, then calls updateRankMathMeta.
 * Skips rows marked "done". If successful, marks the row as "done".
 */
function processSheet() {
  var ui = SpreadsheetApp.getUi();
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Sheet1');
  if (!sheet) {
    Logger.log('Error: Sheet "Sheet1" not found. Script cannot proceed.');
    ui.alert('Error: Sheet "Sheet1" not found! Please ensure the sheet exists and is named correctly.');
    return;
  }

  var dataRange = sheet.getDataRange();
  var data = dataRange.getValues(); // data[0] is the header row
  var numRowsProcessed = 0;
  var numRowsSkipped = 0;
  var numRowsSuccessfullyUpdated = 0;
  var numRowsFailed = 0;

  Logger.log('Starting processing of sheet: "' + sheet.getName() + '"');

  // Loop through each data row (skipping the header row, i = 0).
  // data[i] corresponds to sheet row i + 1.
  for (var i = 1; i < data.length; i++) {
    var currentSheetRow = i + 1; // 1-indexed for sheet rows
    var rowArray = data[i];     // Current row's data as an array

    try {
      var statusCell = rowArray[4]; // Column E (index 4) for "done" status

      // Skip if Post ID (column A, index 0) is empty
      if (!rowArray[0] || rowArray[0].toString().trim() === "") {
        Logger.log('Row ' + currentSheetRow + ': Skipped. Post ID is empty.');
        numRowsSkipped++;
        continue;
      }

      // Skip if row is already marked "done"
      if (statusCell && statusCell.toString().toLowerCase() === 'done') {
        Logger.log('Row ' + currentSheetRow + ': Skipped. Already marked "done".');
        numRowsSkipped++;
        continue;
      }

      var postId = rowArray[0];
      var title = rowArray[2];  // Column C (index 2): Title
      var description = rowArray[3]; // Column D (index 3): Description

      Logger.log('Row ' + currentSheetRow + ': Processing Post ID=' + postId + (title ? (', Title=' + title) : ', Title=N/A'));

      var success = updateRankMathMeta(postId, title, description);

      if (success) {
        sheet.getRange(currentSheetRow, 5).setValue('done'); // Column E (5th column)
        Logger.log('Row ' + currentSheetRow + ': Successfully updated Post ID ' + postId + '. Marked as "done".');
        numRowsSuccessfullyUpdated++;
      } else {
        Logger.log('Row ' + currentSheetRow + ': Failed to update Post ID ' + postId + '. Not marked as "done". See previous logs for API error details.');
        numRowsFailed++;
      }
      numRowsProcessed++;

    } catch (e) {
      Logger.log('Row ' + currentSheetRow + ': Encountered an unexpected error during processing. Error: ' + e.toString() + ' Stack: ' + e.stack);
      numRowsFailed++; // Count this as a failure for this row
      // Continue to the next row
    }
  }

  Logger.log('Finished processing sheet.');
  Logger.log('Summary: Processed=' + numRowsProcessed + ', Skipped=' + numRowsSkipped + ', Succeeded=' + numRowsSuccessfullyUpdated + ', Failed=' + numRowsFailed);
  ui.alert('Finished processing sheet.\n\n' +
           'Processed: ' + numRowsProcessed + '\n' +
           'Skipped: ' + numRowsSkipped + '\n' +
           'Succeeded: ' + numRowsSuccessfullyUpdated + '\n' +
           'Failed: ' + numRowsFailed + '\n\n' +
           'Check logs for details and any errors.');
}

/**
 * Updates Rank Math meta for a given post using WordPress REST API.
 * @param {string} postId The ID of the post to update.
 * @param {string} title The new title for the post.
 * @param {string} description The new description for the post.
 * @return {boolean} True if the update was successful, false otherwise.
 */
function updateRankMathMeta(postId, title, description) {
  // Check for placeholder configuration values
  if (!WORDPRESS_URL || WORDPRESS_URL === "YOUR_SITE_URL" ||
      !APPLICATION_PASSWORD || APPLICATION_PASSWORD === "YOUR_APPLICATION_PASSWORD" ||
      !WORDPRESS_USERNAME || WORDPRESS_USERNAME === "YOUR_WORDPRESS_USERNAME") {
    Logger.log("Configuration Error: WordPress URL, Application Password, or Username is not set with actual values in the script's global variables. Please update them and try again.");
    SpreadsheetApp.getUi().alert("Configuration Error: WordPress URL, Application Password, or Username is not set. Please update the script's global variables (WORDPRESS_URL, APPLICATION_PASSWORD, WORDPRESS_USERNAME).");
    return false;
  }

  var apiUrl = WORDPRESS_URL.replace(/\/+$/, "") + "/wp-json/rankmath/v1/updateMeta";

  var payload = {
    "objectID": postId,
    "title": title,
    "description": description
  };

  var options = {
    "method": "post",
    "contentType": "application/json",
    "headers": {
      "Authorization": "Basic " + Utilities.base64Encode(WORDPRESS_USERNAME + ":" + APPLICATION_PASSWORD)
    },
    "payload": JSON.stringify(payload),
    "muteHttpExceptions": true // Important to handle errors manually
  };

  try {
    Logger.log("API Call for Post ID " + postId + ": Attempting to update meta at URL: " + apiUrl);
    // Logger.log("Payload for Post ID " + postId + ": " + JSON.stringify(payload)); // Uncomment for debugging sensitive data

    var response = UrlFetchApp.fetch(apiUrl, options);
    var responseCode = response.getResponseCode();
    var responseBody = response.getContentText();

    Logger.log('API Response for Post ID ' + postId + ': HTTP Status Code ' + responseCode);

    if (responseCode === 200) {
      var jsonResponse = JSON.parse(responseBody);
      if (jsonResponse.success) {
        Logger.log('API Success for Post ID ' + postId + ': Rank Math meta updated successfully. Message: ' + (jsonResponse.message || 'N/A'));
        return true;
      } else {
        Logger.log('API Error for Post ID ' + postId + ': Rank Math API reported failure. Message: ' + (jsonResponse.message || 'No specific message.') + ' Response Body: ' + responseBody);
        return false;
      }
    } else {
      Logger.log('API Error for Post ID ' + postId + ': Failed to update Rank Math meta. HTTP Status Code: ' + responseCode + '. Response Body: ' + responseBody);
      return false;
    }
  } catch (e) {
    Logger.log('API Exception for Post ID ' + postId + ': Error during API call. Error: ' + e.toString() + ' Stack: ' + e.stack);
    return false;
  }
}
