# Tag Management Features

## Policy

This project uses Shlink's tag feature to manage project and team tags.

### Tag Format

All tags must follow the `{prefix}:{tag-name}` format.

### Prefixes

Prefixes are defined by the system and are **not visible in the UI**.

- **`team`**: Team tags (e.g., `team:marketing`)
- **`project`**: Project tags (e.g., `project:launch-2025`)
- **`createdBy`**: Creator tags (e.g., `createdBy:user@example.com`)
- **`custom`**: Custom tags (e.g., `custom:campaign`). Generally, all user-created tags are `custom` tags.

### UI Display Rules

- **Prefix Visibility**: Prefixes should never be shown in the UI.
- **Filtering**: In general lists (like URL list), only `custom` tags should be displayed unless specified otherwise. System tags (`team`, `project`, `createdBy`) are for internal management and filtering.

### Renaming Tags

You can rename an existing tag. This will update all short URLs associated with the old tag name to the new tag name.

1.  Navigate to the **Tags** page.
2.  Find the tag you want to rename in the list.
3.  Click the **Edit** (pencil) icon in the **Actions** column.
4.  In the dialog, modify the tag name.
5.  Click **Save**.

### Deleting Tags

You can delete a tag. This will remove the tag from all associated short URLs. The short URLs themselves will not be deleted.

1.  Navigate to the **Tags** page.
2.  Find the tag you want to delete.
3.  Click the **Edit** (pencil) icon.
4.  Click the **Delete** (trash) icon in the dialog.
5.  Confirm the deletion in the warning popup.

> [!NOTE]
> **Future Feature**: Tag coloring is currently not supported but is planned for a future release. It will allow you to assign colors to tags for better visual organization.

## Technical Details

### Tag Creation Workaround

Since the Shlink API does not currently provide a direct endpoint for creating tags, the application uses a workaround:

1.  A temporary short URL is created with the desired tags.
2.  The temporary short URL is immediately deleted.
3.  The tags remain in the system and are available for use.

### Tag Renaming and Deletion

- **Renaming**: Uses the `PUT /tags` endpoint (if available) or equivalent API method to rename a tag.
- **Deletion**: Uses the `DELETE /tags` endpoint to remove tags from the system.

## Features

### Tag List Page (`/tags`)

- Displays a list of all `custom` tags.
- Shows statistics for each tag:
  - **Short URLs**: Number of short URLs associated with the tag.
  - **Visits**: Number of visits for the tag.
- Allows creating new tags (automatically prefixed with `custom:`).
- Search functionality to filter tags.

### URL Creation

- Users can assign tags when creating a short URL.
- New tags entered by the user are automatically prefixed with `custom:`.
- The system automatically adds a `createdBy:{userId}` tag to track ownership.

### URL List

- Displays tags associated with each URL.
- Only `custom` tags are shown (prefix hidden).
