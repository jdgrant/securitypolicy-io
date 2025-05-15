-- Organizations table
CREATE TABLE Organizations (
    OrganizationId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    Name NVARCHAR(255) NOT NULL,
    Industry NVARCHAR(100),
    Size NVARCHAR(50),
    Country NVARCHAR(100),
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE()
);

-- User Roles table
CREATE TABLE UserRoles (
    RoleId INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(50) NOT NULL UNIQUE,
    Description NVARCHAR(255),
    CreatedAt DATETIME2 DEFAULT GETDATE()
);

-- Insert default roles
INSERT INTO UserRoles (Name, Description)
VALUES 
    ('Owner', 'Organization owner with full access'),
    ('Admin', 'Administrator with management capabilities'),
    ('User', 'Standard user with basic access');

-- Users table
CREATE TABLE Users (
    UserId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    OrganizationId UNIQUEIDENTIFIER NOT NULL,
    Email NVARCHAR(255) NOT NULL UNIQUE,
    FirstName NVARCHAR(100),
    LastName NVARCHAR(100),
    JobTitle NVARCHAR(100),
    PhoneNumber NVARCHAR(20),
    PasswordHash NVARCHAR(MAX) NOT NULL,
    PasswordSalt NVARCHAR(MAX) NOT NULL,
    LastPasswordChange DATETIME2 DEFAULT GETDATE(),
    PasswordExpiryDays INT DEFAULT 90,
    FailedLoginAttempts INT DEFAULT 0,
    LastFailedLogin DATETIME2,
    IsLocked BIT DEFAULT 0,
    LockoutUntil DATETIME2,
    IsEmailVerified BIT DEFAULT 0,
    VerificationToken NVARCHAR(100),
    RoleId INT NOT NULL DEFAULT 3, -- Default to 'User' role
    MFAEnabled BIT DEFAULT 1, -- Enable MFA by default for security
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (OrganizationId) REFERENCES Organizations(OrganizationId),
    FOREIGN KEY (RoleId) REFERENCES UserRoles(RoleId)
);

-- Password Reset Tokens table
CREATE TABLE PasswordResetTokens (
    TokenId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NOT NULL,
    Token NVARCHAR(100) NOT NULL,
    ExpiresAt DATETIME2 NOT NULL,
    IsUsed BIT DEFAULT 0,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (UserId) REFERENCES Users(UserId)
);

-- MFA Verification Codes table
CREATE TABLE MFAVerificationCodes (
    CodeId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NOT NULL,
    Code NVARCHAR(6) NOT NULL,
    ExpiresAt DATETIME2 NOT NULL,
    IsUsed BIT DEFAULT 0,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (UserId) REFERENCES Users(UserId)
);

-- Sessions table
CREATE TABLE Sessions (
    SessionId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER NOT NULL,
    Token NVARCHAR(255) NOT NULL UNIQUE,
    ExpiresAt DATETIME2 NOT NULL,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (UserId) REFERENCES Users(UserId)
);

-- Assessment Types table
CREATE TABLE AssessmentTypes (
    AssessmentTypeId INT PRIMARY KEY IDENTITY(1,1),
    Name NVARCHAR(100) NOT NULL,
    Description NVARCHAR(MAX),
    IsActive BIT DEFAULT 1,
    IsPremium BIT DEFAULT 0,
    CreatedAt DATETIME2 DEFAULT GETDATE()
);

-- Insert initial assessment types
INSERT INTO AssessmentTypes (Name, Description, IsPremium)
VALUES 
    ('Risk Analysis', 'Freemium security risk assessment for organizations', 0),
    ('Compliance Gap Analysis', 'Premium compliance gap assessment', 1),
    ('Vendor Security Assessment', 'Premium vendor security evaluation', 1);

-- Assessments table
CREATE TABLE Assessments (
    AssessmentId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    OrganizationId UNIQUEIDENTIFIER NOT NULL,
    AssessmentTypeId INT NOT NULL,
    InitiatedByUserId UNIQUEIDENTIFIER NOT NULL,
    Score DECIMAL(5,2),
    Status NVARCHAR(20) DEFAULT 'In Progress',
    CompletedAt DATETIME2,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (OrganizationId) REFERENCES Organizations(OrganizationId),
    FOREIGN KEY (AssessmentTypeId) REFERENCES AssessmentTypes(AssessmentTypeId),
    FOREIGN KEY (InitiatedByUserId) REFERENCES Users(UserId)
);

-- Assessment Answers table
CREATE TABLE AssessmentAnswers (
    AnswerId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    AssessmentId UNIQUEIDENTIFIER NOT NULL,
    QuestionId INT NOT NULL,
    Answer NVARCHAR(50) NOT NULL,
    AnsweredByUserId UNIQUEIDENTIFIER NOT NULL,
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (AssessmentId) REFERENCES Assessments(AssessmentId),
    FOREIGN KEY (AnsweredByUserId) REFERENCES Users(UserId)
);

-- Organization Subscriptions table
CREATE TABLE OrganizationSubscriptions (
    SubscriptionId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    OrganizationId UNIQUEIDENTIFIER NOT NULL,
    PlanName NVARCHAR(50) NOT NULL,
    StartDate DATETIME2 NOT NULL,
    EndDate DATETIME2,
    Status NVARCHAR(20) DEFAULT 'Active',
    CreatedAt DATETIME2 DEFAULT GETDATE(),
    UpdatedAt DATETIME2 DEFAULT GETDATE(),
    FOREIGN KEY (OrganizationId) REFERENCES Organizations(OrganizationId)
);

-- Security Events table
CREATE TABLE SecurityEvents (
    EventId UNIQUEIDENTIFIER PRIMARY KEY DEFAULT NEWID(),
    UserId UNIQUEIDENTIFIER,
    Email NVARCHAR(255),
    EventType NVARCHAR(50) NOT NULL,
    IpAddress NVARCHAR(45) NOT NULL,
    UserAgent NVARCHAR(MAX),
    Details NVARCHAR(MAX),
    Timestamp DATETIME2 NOT NULL DEFAULT GETDATE(),
    FOREIGN KEY (UserId) REFERENCES Users(UserId)
);

-- Create indexes for better performance
CREATE INDEX IX_Sessions_Token ON Sessions(Token);
CREATE INDEX IX_Sessions_UserId ON Sessions(UserId);
CREATE INDEX IX_Users_OrganizationId ON Users(OrganizationId);
CREATE INDEX IX_Users_Email ON Users(Email);
CREATE INDEX IX_Assessments_OrganizationId ON Assessments(OrganizationId);
CREATE INDEX IX_AssessmentAnswers_AssessmentId ON AssessmentAnswers(AssessmentId);
CREATE INDEX IX_OrganizationSubscriptions_OrganizationId ON OrganizationSubscriptions(OrganizationId);
CREATE INDEX IX_MFAVerificationCodes_UserId ON MFAVerificationCodes(UserId);
CREATE INDEX IX_MFAVerificationCodes_Code ON MFAVerificationCodes(Code);
CREATE INDEX IX_PasswordResetTokens_Token ON PasswordResetTokens(Token);
CREATE INDEX IX_PasswordResetTokens_UserId ON PasswordResetTokens(UserId);
CREATE INDEX IX_SecurityEvents_UserId ON SecurityEvents(UserId);
CREATE INDEX IX_SecurityEvents_Email ON SecurityEvents(Email);
CREATE INDEX IX_SecurityEvents_EventType ON SecurityEvents(EventType);
CREATE INDEX IX_SecurityEvents_Timestamp ON SecurityEvents(Timestamp); 