-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_companies" (
    "id" TEXT NOT NULL PRIMARY KEY,
    "name" TEXT NOT NULL,
    "slug" TEXT NOT NULL,
    "sector" TEXT NOT NULL,
    "industry" TEXT NOT NULL,
    "subIndustry" TEXT,
    "description" TEXT,
    "logoUrl" TEXT,
    "websiteUrl" TEXT,
    "email" TEXT,
    "phone" TEXT,
    "street" TEXT,
    "suburb" TEXT,
    "state" TEXT,
    "postcode" TEXT,
    "country" TEXT NOT NULL DEFAULT 'Australia',
    "latitude" REAL,
    "longitude" REAL,
    "tags" TEXT NOT NULL DEFAULT '[]',
    "status" TEXT NOT NULL DEFAULT 'pending',
    "views" INTEGER NOT NULL DEFAULT 0,
    "amountSeeking" TEXT,
    "raisingReason" TEXT,
    "properties" TEXT,
    "photos" TEXT NOT NULL DEFAULT '[]',
    "projectPhotos" TEXT NOT NULL DEFAULT '[]',
    "advisorId" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "companies_advisorId_fkey" FOREIGN KEY ("advisorId") REFERENCES "advisors" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_companies" ("advisorId", "amountSeeking", "country", "createdAt", "description", "email", "id", "industry", "latitude", "logoUrl", "longitude", "name", "phone", "photos", "postcode", "properties", "raisingReason", "sector", "slug", "state", "status", "street", "subIndustry", "suburb", "tags", "updatedAt", "views", "websiteUrl") SELECT "advisorId", "amountSeeking", "country", "createdAt", "description", "email", "id", "industry", "latitude", "logoUrl", "longitude", "name", "phone", "photos", "postcode", "properties", "raisingReason", "sector", "slug", "state", "status", "street", "subIndustry", "suburb", "tags", "updatedAt", "views", "websiteUrl" FROM "companies";
DROP TABLE "companies";
ALTER TABLE "new_companies" RENAME TO "companies";
CREATE UNIQUE INDEX "companies_slug_key" ON "companies"("slug");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
