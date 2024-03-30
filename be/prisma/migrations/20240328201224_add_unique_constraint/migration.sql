/*
  Warnings:

  - A unique constraint covering the columns `[eventId,userId]` on the table `Attendance` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Attendance_eventId_userId_key" ON "Attendance"("eventId", "userId");
