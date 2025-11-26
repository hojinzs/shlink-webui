# QR Code Generation

## Background

The QR code generation feature has been removed from the Shlink API (see [issue #2408](https://github.com/shlinkio/shlink/issues/2408)). Consequently, the responsibility for generating QR codes has shifted to the client side.

## Requirements

- **Dedicated Page**: A new page for generating QR codes.
  - Accepts a URL via query string (`?url=`).
  - Allows customization of the QR code.
- **Download**: Users can download the generated QR code as an image.
- **Integration**: The URL list table should link to this generation page instead of relying on an API endpoint.
- **Storage**: QR code images are generated on-the-fly and not stored on the server (for now).

## Features

### QR Code Generator Page (`/qr-code`)

- **Input**:
  - URL (pre-filled from query string if provided).
- **Customization Options**:
  - **Size**: Adjustable size (e.g., slider).
  - **Margin**: Adjustable margin.
  - **Error Correction**: Levels L, M, Q, H.
  - **Colors**: Foreground and Background color pickers.
  - **Logo**: Option to select/upload a logo to embed in the center.
- **Output**:
  - Real-time preview of the QR code.
  - **Download Button**: Downloads the QR code as a PNG file.

### URL List Integration

- The "QR" action in the URL list will navigate to `/qr-code?url={shortUrl}`.
- This replaces any previous direct image display or API call.

## Technical Implementation

- **Library**: `qr-code-styling` for rendering QR codes (Canvas).
- **Download**: Built-in download functionality of `qr-code-styling`.
