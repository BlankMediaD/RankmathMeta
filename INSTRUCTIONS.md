# Bulk Update Rank Math Meta with Google Sheets

This guide provides step-by-step instructions on how to set up and use the Google App Script to bulk update Rank Math SEO titles and descriptions for your WordPress posts directly from a Google Sheet.

## 1. Accessing Google Apps Script

1.  Open the Google Sheet that contains (or will contain) your post data.
2.  In the top menu, click on **Extensions** > **Apps Script**.
    *   This will open the Google Apps Script editor in a new browser tab.

## 2. Installing the Script

1.  When the Apps Script editor opens, you might see some default code (e.g., in a file named `Code.gs` or inside an "Untitled project"). Delete any existing code in the editor.
2.  Copy the entire content of the provided `Code.gs` script file (the one you received or downloaded).
3.  Paste this copied code into the Apps Script editor, replacing any previous content.
4.  Save the script project:
    *   Click the **Save project** icon (looks like a floppy disk).
    *   You might be asked to name the project. You can name it something like "RankMath Updater".

## 3. Configuring the Script

This is a crucial step. You need to tell the script how to connect to your WordPress site.

1.  In the Apps Script editor, at the very top of the `Code.gs` file, you will see these lines:
    ```javascript
    // Global variables for WordPress site URL, application password, and username.
    // IMPORTANT: Replace placeholder values with your actual WordPress site details.
    var WORDPRESS_URL = "YOUR_SITE_URL";
    var APPLICATION_PASSWORD = "YOUR_APPLICATION_PASSWORD";
    var WORDPRESS_USERNAME = "YOUR_WORDPRESS_USERNAME";
    ```
2.  You **must** replace the placeholder values with your actual WordPress site details:
    *   **`WORDPRESS_URL`**: Change `"YOUR_SITE_URL"` to your WordPress website's address.
        *   Example: If your site is `https://myblog.com`, the line should be `var WORDPRESS_URL = "https://myblog.com";`
        *   **Important:** Do not include a slash (`/`) at the end of the URL.
    *   **`WORDPRESS_USERNAME`**: Change `"YOUR_WORDPRESS_USERNAME"` to the WordPress username that you will use to generate an Application Password. This is your regular WordPress login username.
        *   Example: `var WORDPRESS_USERNAME = "my_wp_admin_user";`
    *   **`APPLICATION_PASSWORD`**: Change `"YOUR_APPLICATION_PASSWORD"` to a valid Application Password generated from your WordPress profile.
        *   **What is an Application Password?** It's a special password you generate in WordPress for external applications like this script to connect to your site securely. It is **NOT** your main WordPress login password.
        *   **How to generate an Application Password:**
            1.  Log in to your WordPress admin dashboard.
            2.  Go to **Users** > **Profile**.
            3.  Scroll down to the "Application Passwords" section.
            4.  Enter a name for the new application password (e.g., "Google Sheets Updater") and click "Add New Application Password".
            5.  WordPress will generate a password (e.g., `xxxx xxxx xxxx xxxx xxxx xxxx`). **Copy this password immediately.** You won't see it again.
            6.  Paste this generated password into the script for `APPLICATION_PASSWORD`.
                *   Example: `var APPLICATION_PASSWORD = "xxxx xxxx xxxx xxxx xxxx xxxx";` (use the actual password you copied).
        *   If you need more help, search for "WordPress Application Passwords" or consult a guide like [this one from WPBeginner](https://www.wpbeginner.com/wp-tutorials/how-to-generate-application-passwords-in-wordpress/) (external link).

3.  After updating these three variables, **Save the project** again by clicking the save icon.

## 4. Preparing Your Google Sheet

The script expects your Google Sheet to have a specific structure. Make sure your active sheet (usually named "Sheet1" by default, if not, the script targets "Sheet1") is set up as follows:

*   **Row 1**: This row should be your **header row** (e.g., "Post ID", "URL", "New Title", "New Description", "Status"). The script automatically skips the first row.
*   **Column A**: **Post ID** (Required)
    *   The unique WordPress ID of the post, page, or custom post type you want to update.
    *   You can find this ID in WordPress, often visible in the URL when editing a post or in some post list views.
*   **Column B**: **Post URL** (Optional)
    *   The URL of the post. This is for your reference only and is not used by the script.
*   **Column C**: **New Meta Title**
    *   The new SEO title you want to set in Rank Math.
*   **Column D**: **New Meta Description**
    *   The new SEO meta description you want to set in Rank Math.
*   **Column E**: **Status**
    *   This column is used by the script to track progress.
    *   If a row is successfully updated, the script will write "done" into this column.
    *   Rows that already have "done" in this column will be skipped by the script.
    *   You can leave this blank initially or use other values like "pending".

**Example Sheet Layout:**

| Post ID | Post URL                 | New Meta Title          | New Meta Description                   | Status  |
| :------ | :----------------------- | :---------------------- | :------------------------------------- | :------ |
| 123     | yourdomain.com/my-post   | My Awesome New Title    | A compelling new description for SEO.  |         |
| 456     | yourdomain.com/another   | Another Great Title     | Description for another amazing post.  | done    |
| 789     | yourdomain.com/page-one  | Updated Page Title Here | Fresh meta description for this page.  |         |

## 5. Running the Script

1.  After setting up the script and your sheet, **refresh your Google Sheet browser page**. This is important for the custom menu to appear.
2.  You should now see a new menu item called **RankMath Updater** in the Google Sheet menu bar.
3.  Click **RankMath Updater** > **Process Sheet**.
4.  **Authorization (First time only):**
    *   The first time you run the script, Google will ask for your permission for the script to access your spreadsheets and connect to external services (your WordPress site).
    *   Click "Continue" or "Review permissions".
    *   Choose your Google account.
    *   You might see a warning "Google hasn't verified this app". This is normal for custom scripts. Click "Advanced" and then "Go to (your project name) (unsafe)".
    *   Review the permissions and click "Allow".

## 6. Checking Results & Logs

1.  **Status Column:** After the script finishes, check Column E ("Status") in your sheet. Rows that were successfully updated will now show "done".
2.  **Completion Alert:** A pop-up alert will appear summarizing how many rows were processed, skipped, succeeded, or failed.
3.  **Execution Logs:** For detailed information about each row's processing, or if you encounter errors:
    *   Go back to the **Apps Script editor**.
    *   In the left sidebar, click **Executions** (looks like a play button with lines).
    *   You will see a list of when the script was run. Click on the most recent one (usually at the top) to see the logs.
    *   The logs provide a step-by-step account of what the script did, including which rows were processed, any API responses, and detailed error messages.

## 7. Important Notes & Troubleshooting

*   **Menu Not Appearing?** If the "RankMath Updater" menu doesn't show up, try refreshing your Google Sheet page a couple of times. Also, ensure you've saved the script in the Apps Script editor.
*   **Rank Math Plugin:** Ensure the Rank Math SEO plugin is installed and activated on your WordPress site.
*   **WordPress REST API:** The WordPress REST API must be enabled. It is enabled by default on most WordPress sites. If you suspect it's disabled (e.g., due to a security plugin), you may need to re-enable it.
*   **Configuration Errors:** If you get an alert about "Configuration Error: WordPress URL, Application Password, or Username is not set", double-check that you have correctly replaced the placeholder values in Step 3.
*   **API Errors:** If logs show errors like "Rank Math API endpoint not found," "HTTP Status Code 404," or similar:
    *   Double-check your `WORDPRESS_URL` in the script. Make sure it's correct and has no trailing slash.
    *   Verify Rank Math is active on your site.
    *   Ensure your Application Password is correct and its associated user has permissions to edit posts.
*   **Application Passwords:** Always use Application Passwords. They are more secure as they can be revoked at any time and are specific to this application. **Do not use your main WordPress password in the script.**
*   **Data Backups:** While the script is designed to update specific fields, it's always a good practice to back up your WordPress site before running bulk updates.
*   **Rate Limits:** If you are updating a very large number of rows (many hundreds or thousands), be mindful of potential rate limits on your server or by Google. It's best to process very large sheets in batches if you encounter timeout errors. The script processes one row at a time.

---

If you encounter persistent issues, review the logs in the Apps Script editor carefully, as they often provide clues to the problem.
