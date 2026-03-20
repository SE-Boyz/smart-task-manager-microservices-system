const mongoose = require("mongoose");

const reportSchema = new mongoose.Schema(
  {
    total: {
      type: Number,
      required: true
    },
    completed: {
      type: Number,
      required: true
    },
    pending: {
      type: Number,
      required: true
    },
    generatedAt: {
      type: String,
      required: true,
      index: true
    }
  },
  {
    versionKey: false,
    collection: "report_summaries"
  }
);

const ReportSummary =
  mongoose.models.ReportSummary || mongoose.model("ReportSummary", reportSchema);

async function saveSummarySnapshot(summary) {
  const createdSummary = await ReportSummary.create(summary);
  return createdSummary.toObject({ versionKey: false });
}

module.exports = {
  saveSummarySnapshot
};
