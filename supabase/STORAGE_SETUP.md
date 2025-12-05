# Supabase Storage Setup Instructions

## Create Storage Bucket

Run this in Supabase SQL Editor or Dashboard:

### 1. Create the bucket
```sql
-- Create uploads bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('uploads', 'uploads', false);
```

### 2. Set up RLS policies for the bucket
```sql
-- Allow authenticated users to upload files
CREATE POLICY "Users can upload own files"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (
  bucket_id = 'uploads' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to read their own files
CREATE POLICY "Users can read own files"
ON storage.objects FOR SELECT
TO authenticated
USING (
  bucket_id = 'uploads' AND
  (storage.foldername(name))[1] = auth.uid()::text
);

-- Allow users to delete their own files
CREATE POLICY "Users can delete own files"
ON storage.objects FOR DELETE
TO authenticated
USING (
  bucket_id = 'uploads' AND
  (storage.foldername(name))[1] = auth.uid()::text
);
```

### 3. Verify bucket exists
```sql
SELECT * FROM storage.buckets WHERE id = 'uploads';
```

## File Upload Structure

Files will be organized as:
```
uploads/
  ├── {user_id}/
  │   ├── {project_id}/
  │   │   ├── {timestamp}_{filename}
```

Example:
```
uploads/
  ├── 550e8400-e29b-41d4-a716-446655440000/
  │   ├── 123e4567-e89b-12d3-a456-426614174000/
  │   │   ├── 1701234567890_whitepaper.pdf
  │   │   ├── 1701234567891_mockup.png
```

## Usage in Code

```typescript
// Upload file
const { data, error } = await supabase.storage
  .from('uploads')
  .upload(`${userId}/${projectId}/${timestamp}_${filename}`, file);

// Get public URL
const { data: { publicUrl } } = supabase.storage
  .from('uploads')
  .getPublicUrl(filePath);

// Download file
const { data, error } = await supabase.storage
  .from('uploads')
  .download(filePath);
```
