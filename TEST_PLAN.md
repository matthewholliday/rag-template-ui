# Test Plan for RAG Data Ingestion UI

## Overview
This test plan covers unit and integration tests for the React UI application. Tests will validate all critical user flows, API integrations, and component behavior.

## Testing Framework
- **Vitest**: Fast unit test runner for Vite projects
- **React Testing Library**: Component testing with user-centric approach
- **MSW (Mock Service Worker)**: API mocking for integration tests

## Test Coverage Areas

### 1. TypeScript Type Tests
- Verify all API types are correctly defined
- Ensure type safety across components

### 2. API Client Tests (`src/services/api.test.ts`)
- Test all API endpoint functions
- Verify correct request formatting
- Validate error handling
- Test response parsing

### 3. Component Tests

#### UI Components (`src/components/ui/*.test.tsx`)
- **Button**: Renders, handles clicks, disabled state
- **Card**: Renders children, applies styles
- **Input**: Handles changes, validation
- **LoadingSpinner**: Renders with correct styling
- **ErrorMessage**: Displays error text

#### Layout Components (`src/components/layout/*.test.tsx`)
- **Header**: Renders navigation, responsive menu
- **Layout**: Wraps children correctly

### 4. Page Component Tests

#### DocumentUpload (`src/pages/DocumentUpload.test.tsx`)
- File selection works
- Metadata form fields function
- Upload triggers API call
- Success message displays
- Error handling works
- Form clears after success

#### DocumentList (`src/pages/DocumentList.test.tsx`)
- Documents render in list
- Pagination controls work
- Delete confirmation shows
- Status badges display correctly
- Navigation to details works
- Loading state shows while fetching

#### DocumentDetails (`src/pages/DocumentDetails.test.tsx`)
- Document data displays
- Chunks list renders
- Reprocess button triggers API
- Delete button works
- Back navigation functions
- Handles document not found

#### Search (`src/pages/Search.test.tsx`)
- Search input accepts text
- Submit triggers query API
- Results display with scores
- Links to documents work
- Empty state shows when no results
- Loading state during search

#### Home (`src/pages/Home.test.tsx`)
- Status displays from API
- Navigation links work
- Handles API errors gracefully

### 5. Integration Tests

#### Document Upload Flow
1. User selects file
2. Fills metadata
3. Submits form
4. API called with correct data
5. Success message shown
6. Form resets

#### Document Management Flow
1. Load document list
2. View document details
3. Trigger reprocessing
4. View chunks
5. Delete document
6. Return to list

#### Search Flow
1. Enter search query
2. Select result limit
3. Submit search
4. Results display
5. Click result to view document

### 6. Error Handling Tests
- Network errors display user-friendly messages
- 404 errors handled
- 400 bad request errors handled
- File upload errors shown
- API unavailable scenario

### 7. Responsive Design Tests
- Components render correctly on mobile
- Navigation adapts to small screens
- Tables/grids stack properly

## Test Files Structure

```
src/
├── services/
│   ├── api.ts
│   └── api.test.ts
├── components/
│   ├── ui/
│   │   ├── Button.tsx
│   │   ├── Button.test.tsx
│   │   ├── Card.tsx
│   │   ├── Card.test.tsx
│   │   ├── Input.tsx
│   │   ├── Input.test.tsx
│   │   ├── LoadingSpinner.tsx
│   │   ├── LoadingSpinner.test.tsx
│   │   ├── ErrorMessage.tsx
│   │   └── ErrorMessage.test.tsx
│   └── layout/
│       ├── Header.tsx
│       ├── Header.test.tsx
│       ├── Layout.tsx
│       └── Layout.test.tsx
├── pages/
│   ├── Home.tsx
│   ├── Home.test.tsx
│   ├── DocumentUpload.tsx
│   ├── DocumentUpload.test.tsx
│   ├── DocumentList.tsx
│   ├── DocumentList.test.tsx
│   ├── DocumentDetails.tsx
│   ├── DocumentDetails.test.tsx
│   ├── Search.tsx
│   └── Search.test.tsx
└── test/
    ├── setup.ts (Vitest setup)
    └── mocks/
        ├── handlers.ts (MSW handlers)
        └── mockData.ts (Mock API responses)
```

## Success Criteria

Tests should:
1. Cover all critical user paths
2. Validate API integrations
3. Test error scenarios
4. Run fast (< 5 seconds for full suite)
5. Be maintainable and readable
6. Not test implementation details
7. Focus on user behavior

## Test Execution

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage

# Run specific test file
npm test -- DocumentUpload.test.tsx
```

## Coverage Goals

- Critical user flows: 100%
- API client: 90%+
- UI components: 80%+
- Pages: 85%+
- Overall: 80%+
