import mongoose from 'mongoose'

export interface ReportSummaryRecord {
  total: number
  completed: number
  pending: number
  generatedAt: string
}

const reportSchema = new mongoose.Schema<ReportSummaryRecord>(
  {
    total: {
      type: Number,
      required: true,
    },
    completed: {
      type: Number,
      required: true,
    },
    pending: {
      type: Number,
      required: true,
    },
    generatedAt: {
      type: String,
      required: true,
      index: true,
    },
  },
  {
    versionKey: false,
    collection: 'report_summaries',
  },
)

const ReportSummary =
  mongoose.models.ReportSummary ||
  mongoose.model<ReportSummaryRecord>('ReportSummary', reportSchema)

export async function saveSummarySnapshot(summary: ReportSummaryRecord) {
  const createdSummary = await ReportSummary.create(summary)
  return createdSummary.toObject({ versionKey: false })
}
