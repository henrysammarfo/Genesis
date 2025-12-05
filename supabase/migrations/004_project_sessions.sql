-- =====================================================
-- GENESIS PROJECT SESSIONS SCHEMA
-- Complete database for multi-project chat sessions
-- =====================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- =====================================================
-- PROJECTS TABLE (Chat Sessions)
-- =====================================================
CREATE TABLE IF NOT EXISTS projects (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT DEFAULT 'active', -- 'active', 'archived', 'deleted'
    metadata JSONB DEFAULT '{}', -- Store additional project info
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Index for faster queries
CREATE INDEX IF NOT EXISTS idx_projects_user_id ON projects(user_id);
CREATE INDEX IF NOT EXISTS idx_projects_status ON projects(status);
CREATE INDEX IF NOT EXISTS idx_projects_created_at ON projects(created_at DESC);

-- RLS Policies for projects
ALTER TABLE projects ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view own projects" ON projects;
CREATE POLICY "Users can view own projects" ON projects
    FOR SELECT USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can create own projects" ON projects;
CREATE POLICY "Users can create own projects" ON projects
    FOR INSERT WITH CHECK (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can update own projects" ON projects;
CREATE POLICY "Users can update own projects" ON projects
    FOR UPDATE USING (auth.uid() = user_id);

DROP POLICY IF EXISTS "Users can delete own projects" ON projects;
CREATE POLICY "Users can delete own projects" ON projects
    FOR DELETE USING (auth.uid() = user_id);

-- =====================================================
-- PROJECT MESSAGES TABLE (Chat History)
-- =====================================================
CREATE TABLE IF NOT EXISTS project_messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    role TEXT NOT NULL CHECK (role IN ('user', 'assistant', 'system')),
    content TEXT NOT NULL,
    metadata JSONB DEFAULT '{}', -- Store plan, code, tokens, etc.
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_project_messages_project_id ON project_messages(project_id);
CREATE INDEX IF NOT EXISTS idx_project_messages_created_at ON project_messages(created_at);

-- RLS Policies
ALTER TABLE project_messages ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view messages in own projects" ON project_messages;
CREATE POLICY "Users can view messages in own projects" ON project_messages
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE projects.id = project_messages.project_id 
            AND projects.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can create messages in own projects" ON project_messages;
CREATE POLICY "Users can create messages in own projects" ON project_messages
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE projects.id = project_messages.project_id 
            AND projects.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can delete messages in own projects" ON project_messages;
CREATE POLICY "Users can delete messages in own projects" ON project_messages
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE projects.id = project_messages.project_id 
            AND projects.user_id = auth.uid()
        )
    );

-- =====================================================
-- PROJECT FILES TABLE (Generated Code)
-- =====================================================
CREATE TABLE IF NOT EXISTS project_files (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    path TEXT NOT NULL,
    content TEXT NOT NULL,
    type TEXT NOT NULL, -- 'contract', 'frontend', 'backend', 'test', 'config'
    language TEXT, -- 'solidity', 'typescript', 'javascript', etc.
    size_bytes INTEGER,
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_project_files_project_id ON project_files(project_id);
CREATE INDEX IF NOT EXISTS idx_project_files_type ON project_files(type);
CREATE INDEX IF NOT EXISTS idx_project_files_created_at ON project_files(created_at);

-- RLS Policies
ALTER TABLE project_files ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view files in own projects" ON project_files;
CREATE POLICY "Users can view files in own projects" ON project_files
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE projects.id = project_files.project_id 
            AND projects.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can create files in own projects" ON project_files;
CREATE POLICY "Users can create files in own projects" ON project_files
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE projects.id = project_files.project_id 
            AND projects.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can update files in own projects" ON project_files;
CREATE POLICY "Users can update files in own projects" ON project_files
    FOR UPDATE USING (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE projects.id = project_files.project_id 
            AND projects.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can delete files in own projects" ON project_files;
CREATE POLICY "Users can delete files in own projects" ON project_files
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE projects.id = project_files.project_id 
            AND projects.user_id = auth.uid()
        )
    );

-- =====================================================
-- PROJECT UPLOADS TABLE (User Uploaded Files)
-- =====================================================
CREATE TABLE IF NOT EXISTS project_uploads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    project_id UUID NOT NULL REFERENCES projects(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    type TEXT NOT NULL, -- 'document', 'image'
    mime_type TEXT NOT NULL,
    size_bytes INTEGER NOT NULL,
    storage_path TEXT NOT NULL, -- Path in Supabase Storage
    url TEXT, -- Public URL if applicable
    metadata JSONB DEFAULT '{}',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS idx_project_uploads_project_id ON project_uploads(project_id);
CREATE INDEX IF NOT EXISTS idx_project_uploads_type ON project_uploads(type);

-- RLS Policies
ALTER TABLE project_uploads ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Users can view uploads in own projects" ON project_uploads;
CREATE POLICY "Users can view uploads in own projects" ON project_uploads
    FOR SELECT USING (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE projects.id = project_uploads.project_id 
            AND projects.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can create uploads in own projects" ON project_uploads;
CREATE POLICY "Users can create uploads in own projects" ON project_uploads
    FOR INSERT WITH CHECK (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE projects.id = project_uploads.project_id 
            AND projects.user_id = auth.uid()
        )
    );

DROP POLICY IF EXISTS "Users can delete uploads in own projects" ON project_uploads;
CREATE POLICY "Users can delete uploads in own projects" ON project_uploads
    FOR DELETE USING (
        EXISTS (
            SELECT 1 FROM projects 
            WHERE projects.id = project_uploads.project_id 
            AND projects.user_id = auth.uid()
        )
    );

-- =====================================================
-- FUNCTIONS
-- =====================================================

-- Update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Trigger for projects
DROP TRIGGER IF EXISTS update_projects_updated_at ON projects;
CREATE TRIGGER update_projects_updated_at
    BEFORE UPDATE ON projects
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Trigger for project_files
DROP TRIGGER IF EXISTS update_project_files_updated_at ON project_files;
CREATE TRIGGER update_project_files_updated_at
    BEFORE UPDATE ON project_files
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- =====================================================
-- VERIFICATION QUERIES
-- =====================================================

-- Check all tables exist
SELECT 
    'projects' as table_name,
    COUNT(*) as row_count
FROM projects
UNION ALL
SELECT 
    'project_messages' as table_name,
    COUNT(*) as row_count
FROM project_messages
UNION ALL
SELECT 
    'project_files' as table_name,
    COUNT(*) as row_count
FROM project_files
UNION ALL
SELECT 
    'project_uploads' as table_name,
    COUNT(*) as row_count
FROM project_uploads;
