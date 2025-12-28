# UTM Parameter Builder

This document describes the UTM Parameter Builder feature in Shlink WebUI, which allows users to add UTM tracking parameters when creating or editing short URLs.

## Overview

The UTM Parameter Builder provides a user-friendly interface for adding UTM (Urchin Tracking Module) parameters to URLs. These parameters are commonly used for tracking marketing campaigns in analytics tools like Google Analytics.

## Features

### Supported UTM Parameters

The builder supports all standard UTM parameters:

| Parameter | Description | Example |
|-----------|-------------|---------|
| `utm_source` | Identifies which site sent the traffic | google, newsletter, facebook |
| `utm_medium` | Identifies what type of link was used | cpc, banner, email |
| `utm_campaign` | Identifies a specific product promotion or campaign | summer-sale, product-launch |
| `utm_term` | Identifies search terms (optional) | running+shoes, red+sneakers |
| `utm_content` | Identifies what specifically was clicked (optional) | logolink, textlink |

### Key Functionality

1. **Optional Parameters**: All UTM parameters are optional. Users can add any combination of parameters.

2. **Real-time URL Preview**: As users enter UTM values, a preview of the final URL with all parameters is displayed.

3. **Tag Generation Preview**: Shows the tags that will be created from the UTM parameters.

4. **Validation**: 
   - Only alphanumeric characters, hyphens, underscores, and periods are allowed
   - Invalid characters trigger immediate validation errors
   - Form submission is blocked until validation errors are resolved

5. **Tag Storage**: UTM parameters are stored as tags in the format `{utm_parameter}:{value}`:
   - `utm_source:google`
   - `utm_medium:banner`
   - `utm_campaign:summer-sale`

## Usage

### Creating a URL with UTM Parameters

1. Navigate to the "Create Short URL" page
2. Enter the destination URL
3. Click "Add UTM parameters" to expand the UTM builder
4. Fill in the desired UTM parameters
5. Review the URL preview and generated tags
6. Click "Create Short URL"

### Editing UTM Parameters

1. Navigate to the "Edit Short URL" page for an existing URL
2. If the URL has existing UTM parameters (either in the URL or as tags), they will be pre-populated
3. Modify the UTM parameters as needed
4. Click "Save Changes"

## Technical Details

### Tag Prefix Policy

UTM parameters follow the repository's tag prefix policy:

- Tags are stored with the UTM parameter name as the prefix
- Format: `{utm_parameter}:{value}`
- Examples:
  - `utm_source:google`
  - `utm_medium:cpc`
  - `utm_campaign:holiday-2024`

### URL Construction

When a short URL is created or updated:

1. The base URL is taken from the "URL to be shortened" field
2. UTM parameters are appended as query string parameters
3. The final URL is stored as the long URL in Shlink
4. UTM values are also stored as tags for filtering and analytics

### Validation Rules

UTM parameter values must:
- Contain only letters (a-z, A-Z), numbers (0-9), hyphens (-), underscores (_), periods (.), and plus signs (+)
- Not contain spaces or other special characters
- Be URL-safe

## Best Practices

1. **Consistent Naming**: Use consistent naming conventions for campaigns across all URLs
2. **Lowercase Values**: Consider using lowercase values for consistency
3. **No Spaces**: Use hyphens or underscores instead of spaces
4. **Descriptive Names**: Use descriptive campaign names that are easy to identify in analytics

## Related Documentation

- [Short URL Management](./manage-short-url.md)
- [Tag Management](./tag-management.md)

## References

- [Google Analytics UTM Parameters](https://support.google.com/analytics/answer/1033863)
- [Bitly UTM Tracking](https://bitly.com/pages/features/utm-tracking)
