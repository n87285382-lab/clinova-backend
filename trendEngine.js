// ==========================================
// Determine Trend From Follow-Up Answer
// ==========================================
function determineFollowUpTrend(
    trackKey,
    answerValue
) {

    if (
        !trackKey ||
        !answerValue
    ) {
        return "not_comparable";
    }

    const improvingValues = {

        main_problem: [
            "better",
            "slightly_better",
            "much_better",
            "clear_improvement",
            "slight_improvement"
        ],

        daily_impact: [
            "much_less",
            "less"
        ],

        treatment_difficulty: [
            "much_easier",
            "easier"
        ],

        activity_change: [
            "much_easier",
            "easier"
        ],

        experience_issue: [
            "resolved",
            "minor"
        ],

        continuation_barrier: [
            "none",
            "resolved",
            "minor"
        ]
    };

    const stableValues = {

        main_problem: [
            "same",
            "no_clear_improvement"
        ],

        daily_impact: [
            "same"
        ],

        treatment_difficulty: [
            "same"
        ],

        activity_change: [
            "same"
        ],

        experience_issue: [
            "specific"
        ],

        continuation_barrier: [
            "clear"
        ]
    };

    const worseningValues = {

        main_problem: [
            "worse"
        ],

        daily_impact: [
            "worse"
        ],

        treatment_difficulty: [
            "worse"
        ],

        activity_change: [
            "worse"
        ],

        experience_issue: [
            "major"
        ],

        continuation_barrier: [
            "major"
        ]
    };

    if (
        improvingValues[trackKey]?.includes(
            answerValue
        )
    ) {
        return "improving";
    }

    if (
        stableValues[trackKey]?.includes(
            answerValue
        )
    ) {
        return "stable";
    }

    if (
        worseningValues[trackKey]?.includes(
            answerValue
        )
    ) {
        return "worsening";
    }

    return "not_comparable";
}

// ==========================================
// Export
// ==========================================
module.exports = {
    determineFollowUpTrend
};