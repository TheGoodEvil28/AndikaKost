# Booking Approval Conversion Log

Date: 2026-05-31

## Summary

Booking approval now performs automatic conversion from potential tenant to active tenant profile.

## Implemented Behavior

- When booking status is updated to `approved` or `converted`:
  - System finds or creates a `tenant` user account using booking email.
  - System finds or creates the tenant profile.
  - The booked room is assigned to that tenant.
  - Room status is changed to `occupied`.
- Booking status is still saved based on the status sent by admin.

## Safeguards

- If booking email belongs to a non-tenant account, conversion is blocked.
- If booked room is already occupied by another tenant, conversion is blocked.
- If tenant was previously assigned to a different room, previous room is released (`available`) before assigning the booked room.

## Files Updated

- `AndikaKost-Backend/app/services/booking_service.py`
- `AndikaKost-Frontend/src/pages/admin/BookingDetailPage.tsx`
- `README.md`
- `docs/PROJECT_STATUS.md`
