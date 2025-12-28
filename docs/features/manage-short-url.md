# Short URL Management

This document outlines the specifications and policies for managing Short URL entities in the Shlink WebUI, covering creation, editing, and deletion.

## Overview

The Short URL Management feature allows users to control the entire lifecycle of a short URL. This includes generating new short links, modifying existing configurations, and removing obsolete links.

## 1. Create Short URL

### Main Options

- **Long URL**: The destination URL to be shortened. (Required)
- **Tags**: A list of tags to categorize the short URL. Users should be able to select existing tags or create new ones.

### UTM Parameters

The UTM Parameter Builder allows adding campaign tracking parameters to URLs. See [UTM Parameter Builder](./utm-parameter-builder.md) for detailed documentation.

- **utm_source**: Identifies which site sent the traffic
- **utm_medium**: Identifies what type of link was used
- **utm_campaign**: Identifies a specific product promotion or campaign
- **utm_term**: Identifies search terms (optional)
- **utm_content**: Identifies what specifically was clicked (optional)

UTM parameters are automatically appended to the destination URL and stored as tags for filtering.

### Customize the Short URL

- **Title**: A descriptive title for the short URL.
- **Custom Slug**: A custom alias for the short URL (e.g., `mysite/custom-alias`).
- **Short Code Length**: The length of the generated short code (if no custom slug is provided).

### Limit Access to the Short URL

- **Enabled Since**: The date and time from which the short URL becomes active.
- **Enabled Until**: The date and time after which the short URL expires.
- **Maximum Visits Allowed**: The maximum number of visits allowed before the short URL becomes invalid.

### Extra Checks

- **Use Existing URL**: If checked, the system will check if a short URL for the given long URL and tags already exists. If found, it returns the existing one instead of creating a new one.

### Configure Behavior

- **Make it Crawlable**: If checked, the short URL will be crawlable by search engines (robots.txt will allow indexing).
- **Forward Query Params**: If checked, query parameters from the short URL will be forwarded to the long URL on redirect.

## 2. Edit Short URL

Users can modify existing short URLs to update their destination or configuration.

### Modifiable Fields

- **Long URL**: The destination can be changed.
- **Tags**: Tags can be added or removed.
- **Title**: The descriptive title can be updated.
- **Access Limits**: Start date, end date, and max visits can be adjusted.
- **Behavior**: Crawlable status and query param forwarding can be toggled.

### Non-Modifiable Fields

- **Short Code / Custom Slug**: Once created, the short code (or slug) cannot be changed to preserve the link's identity.
- **Domain**: The domain cannot be changed after creation.
- **Creation Date**: The original creation timestamp is immutable.

### UI/UX Requirements

- The Edit form should reuse the structure of the Create form for consistency.
- Fields that cannot be modified should be disabled or hidden.
- A "Save" button should commit the changes.

## 3. Delete Short URL

- Users can delete a short URL, making it permanently invalid.
- A confirmation dialog is required before deletion to prevent accidental data loss.
