-- CreateTable
CREATE TABLE "subjects" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,

    CONSTRAINT "subjects_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "topics" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "subject_id" TEXT NOT NULL,

    CONSTRAINT "topics_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tests" (
    "id" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "duration_minutes" INTEGER NOT NULL,
    "topic_id" TEXT NOT NULL,

    CONSTRAINT "tests_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "questions" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "explanation" TEXT NOT NULL,
    "position" INTEGER NOT NULL,
    "test_id" TEXT NOT NULL,

    CONSTRAINT "questions_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "answer_options" (
    "id" TEXT NOT NULL,
    "text" TEXT NOT NULL,
    "is_correct" BOOLEAN NOT NULL DEFAULT false,
    "position" INTEGER NOT NULL,
    "question_id" TEXT NOT NULL,

    CONSTRAINT "answer_options_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE INDEX "topics_subject_id_idx" ON "topics"("subject_id");

-- CreateIndex
CREATE UNIQUE INDEX "tests_topic_id_key" ON "tests"("topic_id");

-- CreateIndex
CREATE INDEX "questions_test_id_idx" ON "questions"("test_id");

-- CreateIndex
CREATE UNIQUE INDEX "questions_test_id_position_key" ON "questions"("test_id", "position");

-- CreateIndex
CREATE INDEX "answer_options_question_id_idx" ON "answer_options"("question_id");

-- CreateIndex
CREATE UNIQUE INDEX "answer_options_question_id_position_key" ON "answer_options"("question_id", "position");

-- AddForeignKey
ALTER TABLE "topics" ADD CONSTRAINT "topics_subject_id_fkey" FOREIGN KEY ("subject_id") REFERENCES "subjects"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tests" ADD CONSTRAINT "tests_topic_id_fkey" FOREIGN KEY ("topic_id") REFERENCES "topics"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "questions" ADD CONSTRAINT "questions_test_id_fkey" FOREIGN KEY ("test_id") REFERENCES "tests"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "answer_options" ADD CONSTRAINT "answer_options_question_id_fkey" FOREIGN KEY ("question_id") REFERENCES "questions"("id") ON DELETE CASCADE ON UPDATE CASCADE;
