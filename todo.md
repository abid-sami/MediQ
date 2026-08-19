# MediQ AI Performance Tasks

- [x] Trace the AI assistant request path and identify avoidable latency.
- [x] Apply faster model, prompt, and request-flow settings while retaining core clinical-safety behavior.
- [x] Build and test the optimized application.
- [x] Package the updated project as a distributable ZIP archive.

## Admin dashboard repair

- [x] Add the missing React hook import to the admin layout.
- [x] Build and verify the repaired admin route.
- [x] Refresh the downloadable MediQ ZIP archive.

## Indoor navigation control cleanup

- [x] Remove the Ground Floor Plan zoom and reset controls.
- [x] Remove Main Entrance and Emergency Gate from the selectable destinations.
- [x] Verify the responsive Ground Floor Plan still renders correctly.

## Patient portal dynamic data

- [x] Identify hardcoded placeholder records across patient dashboard panels.
- [x] Replace dummy records with dynamic patient-specific data, loading states, and empty states.
- [x] Verify the updated patient portal build and data rendering behavior.

## Hardcoded doctor-name cleanup

- [x] Audit all reported doctor-name defaults and translation strings.
- [x] Replace fixed doctor names with dynamic selections or neutral empty values.
- [x] Validate the affected role panels and remaining source references.

## Recurring admin runtime repair

- [x] Inspect the exact AdminLayout hook import and active runtime source.
- [x] Apply a durable useRef repair and force a clean client rebuild.
- [x] Verify the admin route and refresh the downloadable source ZIP.

## Footer and tablet-header refinement

- [x] Replace footer Login/Register controls with a logout action.
- [x] Resolve tablet-header navigation overlap with language and theme controls.
- [x] Verify desktop, tablet, and mobile header/footer behavior.

## Receptionist registration and navigation

- [x] Remove Date of Birth and set Blood Group to None by default in patient registration.
- [x] Add Driver Account Details and remove Doctor Queue from the receptionist sidebar.
- [x] Verify the receptionist portal build and navigation state.

## Nurse patient and ward-bed repair

- [x] Diagnose and prevent undefined patient fields in My Patients.
- [x] Connect Ward Bed Management to live beds and workable status updates.
- [x] Verify the nurse patient and ward-bed pages without runtime errors.

## Role sidebar cleanup

- [x] Remove the requested Admin, Patient, and Pharmacist sidebar items.
- [x] Verify affected role navigation menus and build output.
- [x] Package the updated project source as a ZIP archive.

## Emergency and support footer destinations

- [x] Audit existing emergency and support routes for reusable destinations.
- [x] Wire Emergency links and create any missing Support pages.
- [x] Verify the footer links and package the refreshed project ZIP.

## Auth-aware footer and nurse navigation

- [x] Show footer Logout only for authenticated users.
- [x] Merge nurse Wards and Beds into one sidebar item.
- [x] Verify both navigation changes and package the refreshed ZIP.

## Phone-number login

- [x] Audit current email-password sign-in and profile phone fields.
- [x] Add phone-number account lookup and sign-in flow without exposing account data.
- [x] Validate the new login path and package the refreshed ZIP.

## Department persistence and Doctors panel

- [x] Diagnose why newly created departments do not persist to the live data source.
- [x] Save valid department records and surface them dynamically in the Doctors panel.
- [x] Build, validate, and package the corrected source archive.

## Department migration enum repair

- [x] Replace the invalid `Super Admin` enum check with the supported administrative role value.
- [x] Validate the revised migration and package the corrected source archive.

## Doctor Profile department catalogue refresh

- [x] Retrieve the shared department catalogue directly when the Doctor Profile opens or refreshes.
- [x] Verify newly created admin departments are selectable in the Doctor Profile and package the updated ZIP.

## Doctor Profile stale department fallback

- [x] Remove the General Medicine cache fallback when the shared department catalogue is unavailable or still loading.
- [x] Resolve the Doctor Profile loading state and verify the selector reflects the current admin catalogue.
- [x] Build and package the corrected source archive.

## Department catalogue access and profile controls

- [x] Repair read access for the shared departments table.
- [x] Remove the Doctor Profile department refresh control.
- [x] Build, validate, and package the corrected source archive.
