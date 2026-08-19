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
