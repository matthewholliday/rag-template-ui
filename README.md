# RAG Data Ingestion UI

A modern, responsive React application for managing documents in a Retrieval-Augmented Generation (RAG) system. This UI provides a complete interface for uploading, processing, and searching documents using semantic search.

## Features

- **Document Upload**: Upload documents with optional metadata (title, description, tags)
- **Document Management**: View, list, and delete documents with pagination
- **Processing Status**: Monitor document processing status in real-time
- **Chunk Viewing**: Explore how documents are chunked for retrieval
- **Semantic Search**: Search across all documents using natural language queries
- **Responsive Design**: Works seamlessly on mobile, tablet, and desktop devices
- **Modern UI**: Clean, professional interface with loading states and error handling

## Tech Stack

- **React 18** with TypeScript
- **Vite** for fast development and optimized builds
- **React Router** for navigation
- **React Hook Form** for form management
- **Vitest** for testing
- **CSS Modules** for styling

## Prerequisites

- Node.js 18+ and npm
- Running instance of the RAG Data Ingestion API

## Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd rag-template-ui
```

2. Install dependencies:
```bash
npm install
```

3. Configure the API endpoint:
```bash
cp .env.example .env
```

Edit `.env` and set your API base URL:
```
VITE_API_BASE_URL=http://localhost:8000/v1
```

## Development

Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:3000`.

## Building for Production

Build the application:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

The build output will be in the `dist/` directory.

## Testing

Run tests:
```bash
npm test
```

Run tests with coverage:
```bash
npm run test:coverage
```

Run tests in watch mode:
```bash
npm test -- --watch
```

## Project Structure

```
src/
├── components/
│   ├── ui/                  # Reusable UI components
│   │   ├── Button.tsx
│   │   ├── Card.tsx
│   │   ├── Input.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── ErrorMessage.tsx
│   └── layout/              # Layout components
│       ├── Header.tsx
│       └── Layout.tsx
├── pages/                   # Page components
│   ├── Home.tsx
│   ├── DocumentUpload.tsx
│   ├── DocumentList.tsx
│   ├── DocumentDetails.tsx
│   └── Search.tsx
├── services/                # API client
│   └── api.ts
├── types/                   # TypeScript types
│   └── api.ts
├── test/                    # Test setup and mocks
│   ├── setup.ts
│   └── mocks/
│       └── mockData.ts
├── App.tsx                  # Main app component
├── main.tsx                 # Entry point
└── index.css                # Global styles
```

## API Integration

The application integrates with the following API endpoints:

- `GET /status` - Health check
- `POST /documents` - Upload document
- `GET /documents` - List documents (with pagination)
- `GET /documents/{id}` - Get document details
- `DELETE /documents/{id}` - Delete document
- `POST /documents/{id}/process` - Reprocess document
- `GET /documents/{id}/chunks` - Get document chunks
- `POST /query` - Semantic search

## Usage Guide

### Uploading Documents

1. Navigate to the Upload page
2. Select a file to upload
3. Optionally add metadata (title, description, tags)
4. Click "Upload"
5. The document will be processed automatically

### Viewing Documents

1. Navigate to the Documents page
2. Browse the list of uploaded documents
3. Use pagination to navigate through pages
4. Click on a document to view details

### Document Details

On the document details page, you can:
- View document metadata and processing status
- See all chunks generated from the document
- Reprocess the document if needed
- Delete the document

### Searching Documents

1. Navigate to the Search page
2. Enter your search query
3. Select the number of results to return
4. Click "Search"
5. Results are ranked by similarity score
6. Click on any result to view the source document

## Environment Variables

- `VITE_API_BASE_URL` - Base URL for the API (default: `http://localhost:8000/v1`)

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Ensure all tests pass
6. Submit a pull request

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.
