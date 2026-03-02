# Specification

## Summary
**Goal:** Make all Returns Page form fields required (including a mandatory video upload), persist video data on-chain, and display submitted return requests with inline video playback in the Admin Panel.

**Planned changes:**
- Update the `/returns` form to require all six fields: Order Number, Customer Name, Email, Reason for Return, Message, and Video Upload; block submission if any field is empty and show per-field inline error messages.
- Add a "Upload Unboxing / Condition Video" section to the Returns Page accepting MP4, MOV, or WEBM files up to 50MB, with a video preview and upload progress bar after file selection.
- Update the backend (`main.mo`) `ReturnRequest` type and `submitReturnRequest` endpoint to accept and persist all six fields including video data (`[Nat8]`) in stable storage.
- Update the Admin Panel (`/admin`) to list all submitted return requests showing Order Number, Customer Name, Email, Message, and an inline playable video with a download button; leave PIN protection untouched.

**User-visible outcome:** Customers must fill all fields and upload a condition video before submitting a return request. Admins can view, play, and download submitted return videos directly from the admin panel.
