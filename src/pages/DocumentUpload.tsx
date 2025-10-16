import React, { useState } from 'react';
import { useForm } from 'react-hook-form';
import Card from '@/components/ui/Card';
import Button from '@/components/ui/Button';
import Input from '@/components/ui/Input';
import ErrorMessage from '@/components/ui/ErrorMessage';
import { uploadDocument } from '@/services/api';
import type { DocumentMetadata } from '@/types/api';

interface UploadFormData {
  file: FileList;
  title: string;
  description: string;
  tags: string;
}

const DocumentUpload: React.FC = () => {
  const { register, handleSubmit, formState: { errors }, reset } = useForm<UploadFormData>();
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const onSubmit = async (data: UploadFormData) => {
    try {
      setUploading(true);
      setError('');
      setSuccess('');

      const file = data.file[0];
      const metadata: DocumentMetadata = {
        title: data.title || undefined,
        description: data.description || undefined,
        tags: data.tags ? data.tags.split(',').map(tag => tag.trim()).filter(Boolean) : undefined,
      };

      await uploadDocument(file, metadata);
      setSuccess('Upload successful! Your document is being processed.');
      reset();
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div>
      <h1 style={{ marginBottom: 'var(--spacing-lg)' }}>Upload Document</h1>

      <Card>
        {error && <ErrorMessage message={error} />}
        {success && <div className="success-message">{success}</div>}

        <form onSubmit={handleSubmit(onSubmit)}>
          <div className="form-group">
            <label className="label" htmlFor="file">
              File <span style={{ color: 'var(--color-danger)' }}>*</span>
            </label>
            <input
              id="file"
              type="file"
              className="input"
              {...register('file', { required: 'File is required' })}
            />
            {errors.file && <div className="error-message">{errors.file.message}</div>}
          </div>

          <Input
            id="title"
            label="Title"
            placeholder="Optional document title"
            {...register('title')}
          />

          <div className="form-group">
            <label className="label" htmlFor="description">
              Description
            </label>
            <textarea
              id="description"
              className="input textarea"
              placeholder="Optional document description"
              {...register('description')}
            />
          </div>

          <Input
            id="tags"
            label="Tags"
            placeholder="tag1, tag2, tag3"
            {...register('tags')}
          />

          <Button type="submit" loading={uploading} disabled={uploading}>
            {uploading ? 'Uploading...' : 'Upload'}
          </Button>
        </form>
      </Card>
    </div>
  );
};

export default DocumentUpload;
