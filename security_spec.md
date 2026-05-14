# Security Specification - Exam Booster

## Data Invariants
1. **User Profiles**: Only the authenticated user can create or modify their own profile. `isAdmin` can only be set via the administrative backend, never by the client.
2. **Content**: Only admins can create, update, or delete educational content (papers, notes, MCQs). All users can read content.
3. **Daily Quizzes**: Only admins can manage daily quizzes. All users can read current quizzes.
4. **Favorites/Recently Viewed**: These are stored within the `User` document, so they inherit the owner-only write restriction.

## The Dirty Dozen Payloads (Rejection Targets)

1. **Identity Theft**: User A tries to update User B's profile.
2. **Privilege Escalation**: User A tries to set `isAdmin: true` in their own profile.
3. **Ghost Fields**: User A tries to inject a `verifiedStudent: true` field into their profile.
4. **Content Tampering**: A non-admin user tries to edit a Physics paper.
5. **Unauthorized Publication**: A student user tries to upload a fake PDF link to the `/content` collection.
6. **ID Poisoning**: Creating a content document with a 2KB string as the ID.
7. **Relational Sync Break**: Creating a favorite for a content ID that doesn't exist.
8. **Resource Exhaustion**: Sending a 2MB string as the `contentBody`.
9. **Timestamp Spoofing**: Setting `createdAt` to a date in the future.
10. **State Shortcut**: Changing a quiz completion status without actually answering questions (if we track state per doc).
11. **PII Leak**: A user tries to 'list' all user profiles to harvest emails.
12. **Admin Impersonation**: A user tries to write to the `/admins/` tracking collection.

## Test Runner (firestore.rules.test.ts)
```typescript
import {
  assertFails,
  assertSucceeds,
  initializeTestEnvironment,
} from '@firebase/rules-unit-testing';

// Test implementation would go here following the above scenarios.
```
