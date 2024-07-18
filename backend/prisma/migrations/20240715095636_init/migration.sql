-- CreateTable
CREATE TABLE "User" (
    "username" TEXT NOT NULL,
    "password" VARCHAR(64) NOT NULL,
    "role" TEXT NOT NULL,

    CONSTRAINT "User_pkey" PRIMARY KEY ("username")
);
