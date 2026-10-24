const questions = {
 adult: {

    // =========================================================
    // SESSION 1 — BASELINE
    // =========================================================

    session1:[

    // ==========================================
    // S1-Q01
    // Version 2
    // ==========================================

    {
        questionId: "S1-Q01",
        sessionNumber: 1,
        order: 1,
        questionSetVersion: 2,

        text: "ما أكثر شيء يسبب لك صعوبة حاليًا؟",

        type: "single",

        category: "patient_state",

        trackKey: "main_problem",

        answers: [

            {
                id: "A1",
                text: "الأعراض أو الألم",
                value: "symptoms",
                nextQuestionId: "S1-Q02"
            },

            {
                id: "A2",
                text: "صعوبة في أداء بعض الأشياء",
                value: "difficulty",
                nextQuestionId: "S1-Q02"
            },

            {
                id: "A3",
                text: "شيء متعلق بتنفيذ خطة العلاج",
                value: "treatment_plan",
                opensFollowUp: true,
                nextQuestionId: "treatment_plan_reason"
            },

            {
                id: "A4",
                text: "شيء آخر",
                value: "other",
                opensFollowUp: true,
                nextQuestionId: "main_problem_other"
            }
        ],

        active: true
    },


    // ==========================================
    // Branch: Treatment Plan Reason
    // Version 2
    // ==========================================

    {
        questionId: "treatment_plan_reason",
        sessionNumber: 1,
        questionSetVersion: 2,

        type: "single",

        category: "patient_state",

        trackKey: "treatment_plan_reason",

        text: "ما الشيء المتعلق بخطة العلاج الذي يسبب لك صعوبة؟",

        answers: [

            {
                id: "A1",
                text: "صعوبة في الالتزام بالمواعيد",
                value: "appointments",
                nextQuestionId: "S1-Q02"
            },

            {
                id: "A2",
                text: "صعوبة في تنفيذ التمارين أو التعليمات",
                value: "instructions",
                nextQuestionId: "S1-Q02"
            },

            {
                id: "A3",
                text: "عدم وضوح بعض التعليمات بالنسبة لي",
                value: "unclear_instructions",
                nextQuestionId: "S1-Q02"
            },

            {
                id: "A4",
                text: "شيء آخر",
                value: "other",
                opensFollowUp: true,
                nextQuestionId: "treatment_plan_other"
            }
        ],

        active: true
    },


    // ==========================================
    // Branch: Treatment Plan Other
    // Version 2
    // ==========================================

    {
        questionId: "treatment_plan_other",
        sessionNumber: 1,
        questionSetVersion: 2,

        type: "text",

        category: "patient_state",

        trackKey: "treatment_plan_other",

        text: "ما الشيء الآخر المتعلق بخطة العلاج الذي تريد توضيحه؟",

        nextQuestionId: "S1-Q02",

        active: true
    },


    // ==========================================
    // Branch: Main Problem Other
    // Version 2
    // ==========================================

    {
        questionId: "main_problem_other",
        sessionNumber: 1,
        questionSetVersion: 2,

        type: "text",

        category: "patient_state",

        trackKey: "main_problem_other",

        text: "ما الشيء الآخر الذي يسبب لك صعوبة حاليًا؟",

        nextQuestionId: "S1-Q02",

        active: true
    },


    // ==========================================
    // S1-Q02
    // Version 2
    // ==========================================
    //
    // لا يوجد Risk هنا لأن دي أول جلسة.
    // السؤال مسؤول عن قياس تأثير المشكلة فقط.
    //
    // ==========================================

    {
        questionId: "S1-Q02",
        sessionNumber: 1,
        order: 2,
        questionSetVersion: 2,

        text: "إلى أي درجة تؤثر هذه المشكلة على حياتك اليومية؟",

        type: "single",

        category: "patient_state",

        trackKey: "daily_impact",

        answers: [

            {
                id: "A1",
                text: "تأثير بسيط",
                value: "low",
                score: 1,
                nextQuestionId: "S1-Q03"
            },

            {
                id: "A2",
                text: "تأثير متوسط",
                value: "medium",
                score: 2,
                nextQuestionId: "S1-Q03"
            },

            {
                id: "A3",
                text: "تأثير كبير",
                value: "high",
                score: 3,
                nextQuestionId: "S1-Q03"
            },

            {
                id: "A4",
                text: "تأثير كبير جدًا",
                value: "very_high",
                score: 4,
                nextQuestionId: "S1-Q03"
            }
        ],

        active: true
    },


    // ==========================================
    // S1-Q03
    // Version 2
    // ==========================================
    //
    // هنا أصبح عندنا:
    // Score + Risk
    //
    // Score:
    // 1 = أفضل
    // 4 = أسوأ
    //
    // Risk:
    // none / low / medium / high
    //
    // ==========================================

    {
        questionId: "S1-Q03",
        sessionNumber: 1,
        order: 3,
        questionSetVersion: 2,

        text: "هل واجهت أي صعوبة في تنفيذ ما طلب منك حتى الآن؟",

        type: "single",

        category: "treatment_adherence",

        trackKey: "treatment_difficulty",

        answers: [

            {
                id: "A1",
                text: "لا، الأمور كانت سهلة بالنسبة لي",
                value: "none",
                score: 1,
                riskLevel: "none",
                nextQuestionId: "S1-Q04"
            },

            {
                id: "A2",
                text: "نعم، واجهت صعوبة بسيطة",
                value: "low",
                score: 2,
                riskLevel: "low",
                opensFollowUp: true,
                nextQuestionId: "treatment_difficulty_reason"
            },

            {
                id: "A3",
                text: "نعم، واجهت صعوبة متوسطة",
                value: "medium",
                score: 3,
                riskLevel: "medium",
                opensFollowUp: true,
                nextQuestionId: "treatment_difficulty_reason"
            },

            {
                id: "A4",
                text: "نعم، واجهت صعوبة كبيرة",
                value: "high",
                score: 4,
                riskLevel: "high",
                opensFollowUp: true,
                nextQuestionId: "treatment_difficulty_reason"
            }
        ],

        active: true
    },


    // ==========================================
    // Branch: Treatment Difficulty Reason
    // Version 2
    // ==========================================

    {
        questionId: "treatment_difficulty_reason",
        sessionNumber: 1,
        questionSetVersion: 2,

        type: "single",

        category: "treatment_adherence",

        trackKey: "treatment_difficulty_reason",

        text: "ما الصعوبة التي واجهتك في تنفيذ ما طُلب منك؟",

        answers: [

            {
                id: "A1",
                text: "صعوبة في الالتزام بالمواعيد",
                value: "appointments",
                nextQuestionId: "S1-Q04"
            },

            {
                id: "A2",
                text: "صعوبة في تنفيذ التمارين أو التعليمات",
                value: "execution",
                nextQuestionId: "S1-Q04"
            },

            {
                id: "A3",
                text: "صعوبة بسبب الوقت أو الظروف اليومية",
                value: "daily_constraints",
                nextQuestionId: "S1-Q04"
            },

            {
                id: "A4",
                text: "شيء آخر",
                value: "other",
                opensFollowUp: true,
                nextQuestionId: "treatment_difficulty_other"
            }
        ],

        active: true
    },


    // ==========================================
    // Branch: Treatment Difficulty Other
    // Version 2
    // ==========================================

    {
        questionId: "treatment_difficulty_other",
        sessionNumber: 1,
        questionSetVersion: 2,

        type: "text",

        category: "treatment_adherence",

        trackKey: "treatment_difficulty_other",

        text: "ما الصعوبة الأخرى التي واجهتك؟",

        nextQuestionId: "S1-Q04",

        active: true
    },


    // ==========================================
    // S1-Q04
    // Version 2
    // ==========================================
    //
    // إعادة تصميم السؤال ليقيس تجربة المريض
    // مع العيادة نفسها.
    //
    // ==========================================

    {
        questionId: "S1-Q04",
        sessionNumber: 1,
        order: 4,
        questionSetVersion: 2,

        text: "كيف تقيّم تجربتك مع العيادة حتى الآن؟",

        type: "single",

        category: "clinic_experience",

        trackKey: "clinic_experience",

        answers: [

            {
                id: "A1",
                text: "التجربة مناسبة جدًا بالنسبة لي",
                value: "excellent",
                score: 1,
                nextQuestionId: "S1-Q05"
            },

            {
                id: "A2",
                text: "التجربة جيدة ولكن هناك بعض الأمور التي تحتاج إلى تحسين",
                value: "good_with_issues",
                score: 2,
                opensFollowUp: true,
                nextQuestionId: "clinic_experience_issue"
            },

            {
                id: "A3",
                text: "هناك أكثر من شيء يسبب لي عدم ارتياح",
                value: "multiple_issues",
                score: 3,
                opensFollowUp: true,
                nextQuestionId: "clinic_experience_issue"
            },

            {
                id: "A4",
                text: "التجربة بشكل عام غير مناسبة بالنسبة لي",
                value: "poor",
                score: 4,
                opensFollowUp: true,
                nextQuestionId: "clinic_experience_issue"
            }
        ],

        active: true
    },


    // ==========================================
    // Branch: Clinic Experience Issue
    // Version 2
    // ==========================================

    {
        questionId: "clinic_experience_issue",
        sessionNumber: 1,
        questionSetVersion: 2,

        type: "single",

        category: "clinic_experience",

        trackKey: "clinic_experience_issue",

        text: "ما الجانب الذي ترى أنه يحتاج إلى تحسين؟",

        answers: [

            {
                id: "A1",
                text: "تكلفة العلاج أو الأسعار",
                value: "pricing",
                nextQuestionId: "S1-Q05"
            },

            {
                id: "A2",
                text: "طريقة التعامل والاهتمام بالمريض",
                value: "staff_treatment",
                nextQuestionId: "S1-Q05"
            },

            {
                id: "A3",
                text: "المواعيد وتنظيم الجلسات",
                value: "appointments",
                nextQuestionId: "S1-Q05"
            },

            {
                id: "A4",
                text: "وضوح شرح الطبيب أو التعليمات",
                value: "doctor_explanation",
                nextQuestionId: "S1-Q05"
            },

            {
                id: "A5",
                text: "وقت الانتظار",
                value: "waiting_time",
                nextQuestionId: "S1-Q05"
            },

            {
                id: "A6",
                text: "سهولة الوصول إلى العيادة",
                value: "accessibility",
                nextQuestionId: "S1-Q05"
            },

            {
                id: "A7",
                text: "شيء آخر",
                value: "other",
                opensFollowUp: true,
                nextQuestionId: "clinic_experience_other"
            }
        ],

        active: true
    },


    // ==========================================
    // Branch: Clinic Experience Other
    // Version 2
    // ==========================================

    {
        questionId: "clinic_experience_other",
        sessionNumber: 1,
        questionSetVersion: 2,

        type: "text",

        category: "clinic_experience",

        trackKey: "clinic_experience_other",

        text: "ما الشيء الآخر الذي ترى أنه يحتاج إلى تحسين؟",

        nextQuestionId: "S1-Q05",

        active: true
    },


    // ==========================================
    // S1-Q05
    // Version 2
    // ==========================================
    //
    // هنا:
    // Score = الصورة العامة
    // Risk = الجزء الخاص الذي يستحق انتباه الطبيب
    //
    // ==========================================

    {
        questionId: "S1-Q05",
        sessionNumber: 1,
        order: 5,
        questionSetVersion: 2,

        text: "هل هناك شيء قد يجعل متابعة الخطة العلاجية أصعب بالنسبة لك؟",

        type: "single",

        category: "risk_detection",

        trackKey: "continuation_barrier",

        answers: [

            {
                id: "A1",
                text: "لا، لا أتوقع وجود شيء يصعّب عليّ المتابعة",
                value: "none",
                score: 1,
                riskLevel: "none",
                nextQuestionId: null
            },

            {
                id: "A2",
                text: "قد أواجه بعض الصعوبة في الالتزام",
                value: "possible_barrier",
                score: 2,
                riskLevel: "low",
                opensFollowUp: true,
                nextQuestionId: "continuation_barrier_reason"
            },

            {
                id: "A3",
                text: "هناك شيء قد يجعل الاستمرار صعبًا بالنسبة لي",
                value: "barrier",
                score: 3,
                riskLevel: "medium",
                opensFollowUp: true,
                nextQuestionId: "continuation_barrier_reason"
            },

            {
                id: "A4",
                text: "أعتقد أن هناك مشكلة قد تمنعني من الاستمرار",
                value: "serious_barrier",
                score: 4,
                riskLevel: "high",
                opensFollowUp: true,
                nextQuestionId: "continuation_barrier_reason"
            }
        ],

        active: true
    },


    // ==========================================
    // Branch: Continuation Barrier Reason
    // Version 2
    // ==========================================

    {
        questionId: "continuation_barrier_reason",
        sessionNumber: 1,
        questionSetVersion: 2,

        type: "single",

        category: "risk_detection",

        trackKey: "continuation_barrier_reason",

        text: "ما السبب الذي قد يجعل متابعة الخطة العلاجية صعبة بالنسبة لك؟",

        answers: [

            {
                id: "A1",
                text: "صعوبة في الالتزام بالمواعيد",
                value: "appointments",
                nextQuestionId: null
            },

            {
                id: "A2",
                text: "ضيق الوقت أو الانشغال",
                value: "time",
                nextQuestionId: null
            },

            {
                id: "A3",
                text: "صعوبة في تنفيذ التعليمات أو التمارين",
                value: "execution",
                nextQuestionId: null
            },

            {
                id: "A4",
                text: "صعوبة في الوصول إلى العيادة أو المواصلات",
                value: "transportation_access",
                nextQuestionId: null
            },

            {
                id: "A5",
                text: "شيء آخر",
                value: "other",
                opensFollowUp: true,
                nextQuestionId: "continuation_barrier_other"
            }
        ],

        active: true
    },


    // ==========================================
    // Branch: Continuation Barrier Other
    // Version 2
    // ==========================================

    {
        questionId: "continuation_barrier_other",
        sessionNumber: 1,
        questionSetVersion: 2,

        type: "text",

        category: "risk_detection",

        trackKey: "continuation_barrier_other",

        text: "ما السبب الآخر الذي قد يؤثر على قدرتك على المتابعة؟",

        nextQuestionId: null,

        active: true
    }

],


    // =========================================================
    // SESSION 2
    // نفس الـTRACKS — أول مقارنة فعلية
    // =========================================================


    // =========================================================
    // SESSION 2
    // =========================================================

    session2: [

        // ==========================================
        // S2-Q01
        // Main Problem
        // ==========================================

        {
            questionId: "S2-Q01",
            sessionNumber: 2,
            questionSetVersion: 2,
            order: 1,

            text: "مقارنة بما كانت عليه المشكلة في بداية المتابعة، ما التغير الذي تلاحظه الآن؟",

            type: "single",

            category: "patient_state",

            trackKey: "main_problem",

            answers: [

                {
                    id: "A1",
                    text: "أصبحت أفضل بشكل واضح",
                    value: "much_better",
                    score: 1,
                    nextQuestionId: "S2-Q02"
                },

                {
                    id: "A2",
                    text: "أصبحت أفضل قليلًا",
                    value: "slightly_better",
                    score: 2,
                    nextQuestionId: "S2-Q02"
                },

                {
                    id: "A3",
                    text: "لم ألاحظ تغيرًا واضحًا",
                    value: "same",
                    score: 3,
                    riskLevel: "medium",
                    nextQuestionId: "S2-Q02"
                },

                {
                    id: "A4",
                    text: "أصبحت أصعب من قبل",
                    value: "worse",
                    score: 4,
                    riskLevel: "high",
                    nextQuestionId: "S2-Q02"
                }
            ],

            active: true
        },


        // ==========================================
        // S2-Q02
        // Daily Impact
        // ==========================================

        {
            questionId: "S2-Q02",
            sessionNumber: 2,
            questionSetVersion: 2,
            order: 2,

            text: "كيف أصبح تأثير المشكلة على أنشطتك وحياتك اليومية مقارنة ببداية المتابعة؟",

            type: "single",

            category: "patient_state",

            trackKey: "daily_impact",

            answers: [

                {
                    id: "A1",
                    text: "أصبح تأثيرها أقل بشكل واضح",
                    value: "much_less",
                    score: 1,
                    nextQuestionId: "S2-Q03"
                },

                {
                    id: "A2",
                    text: "أصبح تأثيرها أقل قليلًا",
                    value: "less",
                    score: 2,
                    nextQuestionId: "S2-Q03"
                },

                {
                    id: "A3",
                    text: "ما زال تأثيرها تقريبًا بنفس الدرجة",
                    value: "same",
                    score: 3,
                    riskLevel: "medium",
                    nextQuestionId: "S2-Q03"
                },

                {
                    id: "A4",
                    text: "أصبح تأثيرها أكبر من قبل",
                    value: "worse",
                    score: 4,
                    riskLevel: "high",
                    nextQuestionId: "S2-Q03"
                }
            ],

            active: true
        },


        // ==========================================
        // S2-Q03
        // Treatment Difficulty
        // ==========================================

        {
            questionId: "S2-Q03",
            sessionNumber: 2,
            questionSetVersion: 2,
            order: 3,

            text: "كيف أصبحت قدرتك على تنفيذ الخطة العلاجية مقارنة بما كانت عليه في البداية؟",

            type: "single",

            category: "treatment_adherence",

            trackKey: "treatment_difficulty",

            answers: [

                {
                    id: "A1",
                    text: "أصبحت أسهل بكثير",
                    value: "much_easier",
                    score: 1,
                    nextQuestionId: "S2-Q05"
                },

                {
                    id: "A2",
                    text: "أصبحت أسهل قليلًا",
                    value: "easier",
                    score: 2,
                    nextQuestionId: "S2-Q05"
                },

                {
                    id: "A3",
                    text: "ما زالت بنفس الصعوبة تقريبًا",
                    value: "same",
                    score: 3,
                    riskLevel: "medium",
                    nextQuestionId: "S2-Q05"
                },

                {
                    id: "A4",
                    text: "أصبحت أصعب من قبل",
                    value: "worse",
                    score: 4,
                    riskLevel: "high",
                    nextQuestionId: "S2-Q05"
                }
            ],

            active: true
        },


        // ==========================================
        // S2-Q05
        // Clinic Experience
        // ==========================================

        {
            questionId: "S2-Q05",
            sessionNumber: 2,
            questionSetVersion: 2,
            order: 4,

            text: "هل ما زال هناك جانب من تجربتك مع العلاج أو العيادة يحتاج إلى تحسين؟",

            type: "single",

            category: "clinic_experience",

            trackKey: "clinic_experience",

            answers: [

                {
                    id: "A1",
                    text: "لا، الأمور أصبحت مناسبة بالنسبة لي",
                    value: "resolved",
                    score: 1,
                    nextQuestionId: "S2-Q06"
                },

                {
                    id: "A2",
                    text: "نعم، هناك جانب بسيط يحتاج إلى تحسين",
                    value: "minor_issue",
                    score: 2,
                    opensFollowUp: true,
                    nextQuestionId: "clinic_experience_issue"
                },

                {
                    id: "A3",
                    text: "نعم، هناك جانب ما زال يسبب لي إزعاجًا",
                    value: "ongoing_issue",
                    score: 3,
                    opensFollowUp: true,
                    nextQuestionId: "clinic_experience_issue"
                },

                {
                    id: "A4",
                    text: "نعم، هناك مشكلة كبيرة تؤثر على تجربتي",
                    value: "major_issue",
                    score: 4,
                    opensFollowUp: true,
                    nextQuestionId: "clinic_experience_issue"
                }
            ],

            active: true
        },


        // ==========================================
        // Branch: Clinic Experience Issue
        // ==========================================

        {
            questionId: "clinic_experience_issue",
            sessionNumber: 2,
            questionSetVersion: 2,

            type: "single",

            category: "clinic_experience",

            trackKey: "clinic_experience_issue",

            text: "ما الجانب الذي ما زلت ترى أنه يحتاج إلى تحسين؟",

            answers: [

                // -------- Clinic --------

                {
                    id: "A1",
                    text: "صعوبة فهم شرح الطبيب أو المشورة أو التعليمات",
                    value: "doctor_explanation",
                    nextQuestionId: "S2-Q06"
                },

                {
                    id: "A2",
                    text: "طريقة التعامل والاهتمام بالمريض",
                    value: "staff_treatment",
                    nextQuestionId: "S2-Q06"
                },

                {
                    id: "A3",
                    text: "السعر أو تكلفة العلاج",
                    value: "pricing",
                    nextQuestionId: "S2-Q06"
                },

                {
                    id: "A4",
                    text: "المواعيد أو تنظيم الجلسات",
                    value: "appointments",
                    nextQuestionId: "S2-Q06"
                },

                {
                    id: "A5",
                    text: "وقت الانتظار أو تنظيم الدخول والخروج",
                    value: "waiting_time",
                    nextQuestionId: "S2-Q06"
                },

                // -------- Patient --------

                {
                    id: "A6",
                    text: "صعوبة الوصول إلى العيادة أو المواصلات",
                    value: "transportation_access",
                    nextQuestionId: "S2-Q06"
                },

                {
                    id: "A7",
                    text: "الانشغال أو ضيق الوقت في حياتي اليومية",
                    value: "time_constraints",
                    nextQuestionId: "S2-Q06"
                },

                {
                    id: "A8",
                    text: "ظروف أو مسؤوليات يومية تجعل المتابعة صعبة",
                    value: "daily_life_constraints",
                    nextQuestionId: "S2-Q06"
                },

                {
                    id: "A9",
                    text: "صعوبة في الالتزام بسبب ظروفي الشخصية",
                    value: "personal_constraints",
                    nextQuestionId: "S2-Q06"
                },

                {
                    id: "A10",
                    text: "سبب آخر متعلق بظروفي",
                    value: "patient_other",
                    opensFollowUp: true,
                    nextQuestionId: "clinic_experience_patient_other"
                }
            ],

            active: true
        },


        // ==========================================
        // Branch: Patient Other Experience
        // ==========================================

        {
            questionId: "clinic_experience_patient_other",
            sessionNumber: 2,
            questionSetVersion: 2,

            type: "text",

            category: "clinic_experience",

            trackKey: "clinic_experience_patient_other",

            text: "ما الظرف الآخر الذي يؤثر على تجربتك أو قدرتك على المتابعة؟",

            nextQuestionId: "S2-Q06",

            active: true
        },


        // ==========================================
        // S2-Q06
        // Continuation Barrier
        // ==========================================

        {
            questionId: "S2-Q06",
            sessionNumber: 2,
            questionSetVersion: 2,
            order: 5,

            text: "هل يوجد حاليًا شيء قد يجعل استمرارك في الخطة العلاجية أصعب من السابق؟",

            type: "single",

            category: "risk_detection",

            trackKey: "continuation_barrier",

            answers: [

                {
                    id: "A1",
                    text: "لا، لا يوجد شيء قد يصعّب عليّ الاستمرار",
                    value: "none",
                    score: 1,
                    nextQuestionId: null
                },

                {
                    id: "A2",
                    text: "لا، بل أصبحت المتابعة أسهل بالنسبة لي",
                    value: "improved",
                    score: 2,
                    nextQuestionId: null
                },

                {
                    id: "A3",
                    text: "ما زالت هناك نفس الصعوبة تقريبًا",
                    value: "same",
                    score: 3,
                    riskLevel: "medium",
                    opensFollowUp: true,
                    nextQuestionId: "continuation_barrier_reason"
                },

                {
                    id: "A4",
                    text: "أصبحت هناك صعوبة أكبر قد تؤثر على استمراري",
                    value: "worse",
                    score: 4,
                    riskLevel: "high",
                    opensFollowUp: true,
                    nextQuestionId: "continuation_barrier_reason"
                }
            ],

            active: true
        },


        // ==========================================
        // Branch: Continuation Barrier Reason
        // ==========================================

        {
            questionId: "continuation_barrier_reason",
            sessionNumber: 2,
            questionSetVersion: 2,

            type: "single",

            category: "risk_detection",

            trackKey: "continuation_barrier_reason",

            text: "ما السبب الذي يجعل الاستمرار في الخطة العلاجية صعبًا بالنسبة لك؟",

            answers: [

                {
                    id: "A1",
                    text: "صعوبة في الالتزام بالمواعيد",
                    value: "appointments",
                    nextQuestionId: null
                },

                {
                    id: "A2",
                    text: "ضيق الوقت أو الانشغال",
                    value: "time",
                    nextQuestionId: null
                },

                {
                    id: "A3",
                    text: "صعوبة في تنفيذ التعليمات أو التمارين",
                    value: "execution",
                    nextQuestionId: null
                },

                {
                    id: "A4",
                    text: "صعوبة في الوصول إلى العيادة أو المواصلات",
                    value: "transportation_access",
                    nextQuestionId: null
                },

                {
                    id: "A5",
                    text: "ظروف أو مسؤوليات يومية تعيق المتابعة",
                    value: "daily_life",
                    nextQuestionId: null
                },

                {
                    id: "A6",
                    text: "سبب آخر",
                    value: "other",
                    opensFollowUp: true,
                    nextQuestionId: "continuation_barrier_other"
                }
            ],

            active: true
        },


        // ==========================================
        // Branch: Continuation Barrier Other
        // ==========================================

        {
            questionId: "continuation_barrier_other",
            sessionNumber: 2,
            questionSetVersion: 2,

            type: "text",

            category: "risk_detection",

            trackKey: "continuation_barrier_other",

            text: "ما السبب الآخر الذي قد يؤثر على قدرتك على المتابعة؟",

            nextQuestionId: null,

            active: true
        }

    ],



    // =========================================================
    // SESSION 3
    // =========================================================

    session3: [

        // ==========================================
        // S3-Q01
        // Main Problem
        // ==========================================

        {
            questionId: "S3-Q01",
            sessionNumber: 3,
            questionSetVersion: 2,
            order: 1,

            text: "مقارنة ببداية المتابعة، كيف ترى المشكلة الأساسية الآن؟",

            type: "single",

            category: "patient_state",

            trackKey: "main_problem",

            answers: [

                {
                    id: "A1",
                    text: "تحسنت بشكل واضح",
                    value: "much_better",
                    score: 1,
                    nextQuestionId: "S3-Q02"
                },

                {
                    id: "A2",
                    text: "تحسنت قليلًا",
                    value: "better",
                    score: 2,
                    nextQuestionId: "S3-Q02"
                },

                {
                    id: "A3",
                    text: "لم تتغير بشكل واضح",
                    value: "same",
                    score: 3,
                    riskLevel: "medium",
                    nextQuestionId: "S3-Q02"
                },

                {
                    id: "A4",
                    text: "أصبحت أسوأ",
                    value: "worse",
                    score: 4,
                    riskLevel: "high",
                    nextQuestionId: "S3-Q02"
                }
            ],

            active: true
        },


        // ==========================================
        // S3-Q02
        // Daily Impact
        // ==========================================

        {
            questionId: "S3-Q02",
            sessionNumber: 3,
            questionSetVersion: 2,
            order: 2,

            text: "مقارنة بالجلسة السابقة، كيف أصبح تأثير المشكلة على حياتك اليومية؟",

            type: "single",

            category: "patient_state",

            trackKey: "daily_impact",

            answers: [

                {
                    id: "A1",
                    text: "أصبح أقل بكثير",
                    value: "much_less",
                    score: 1,
                    nextQuestionId: "S3-Q03"
                },

                {
                    id: "A2",
                    text: "أصبح أقل",
                    value: "less",
                    score: 2,
                    nextQuestionId: "S3-Q03"
                },

                {
                    id: "A3",
                    text: "ما زال كما هو تقريبًا",
                    value: "same",
                    score: 3,
                    riskLevel: "medium",
                    nextQuestionId: "S3-Q03"
                },

                {
                    id: "A4",
                    text: "أصبح أكبر",
                    value: "worse",
                    score: 4,
                    riskLevel: "high",
                    nextQuestionId: "S3-Q03"
                }
            ],

            active: true
        },


        // ==========================================
        // S3-Q03
        // Treatment Difficulty
        // ==========================================

        {
            questionId: "S3-Q03",
            sessionNumber: 3,
            questionSetVersion: 2,
            order: 3,

            text: "مقارنة بالجلسة السابقة، كيف أصبحت قدرتك على تنفيذ الخطة العلاجية؟",

            type: "single",

            category: "treatment_adherence",

            trackKey: "treatment_difficulty",

            answers: [

                {
                    id: "A1",
                    text: "أصبحت أسهل بكثير",
                    value: "much_easier",
                    score: 1,
                    nextQuestionId: "S3-Q06"
                },

                {
                    id: "A2",
                    text: "أصبحت أسهل",
                    value: "easier",
                    score: 2,
                    nextQuestionId: "S3-Q06"
                },

                {
                    id: "A3",
                    text: "لم تتغير وما زالت بنفس الصعوبة تقريبًا",
                    value: "same",
                    score: 3,
                    riskLevel: "medium",
                    nextQuestionId: "S3-Q06"
                },

                {
                    id: "A4",
                    text: "أصبحت أصعب",
                    value: "worse",
                    score: 4,
                    riskLevel: "high",
                    nextQuestionId: "S3-Q06"
                }
            ],

            active: true
        },


        // ==========================================
        // S3-Q06
        // Continuation Barrier
        // ==========================================

        {
            questionId: "S3-Q06",
            sessionNumber: 3,
            questionSetVersion: 2,
            order: 4,

            text: "هل ما زال هناك شيء قد يؤثر على استمرارك في الخطة العلاجية؟",

            type: "single",

            category: "risk_detection",

            trackKey: "continuation_barrier",

            answers: [

                {
                    id: "A1",
                    text: "لا، لا يوجد شيء حاليًا",
                    value: "none",
                    score: 1,
                    nextQuestionId: "S3-Q07"
                },

                {
                    id: "A2",
                    text: "لا، بل أصبحت المتابعة أسهل بالنسبة لي",
                    value: "improved",
                    score: 2,
                    nextQuestionId: "S3-Q07"
                },

                {
                    id: "A3",
                    text: "ما زالت هناك نفس الصعوبة تقريبًا",
                    value: "same",
                    score: 3,
                    riskLevel: "medium",
                    opensFollowUp: true,
                    nextQuestionId: "continuation_barrier_reason_s3"
                },

                {
                    id: "A4",
                    text: "أصبحت هناك مشكلة أكبر قد تؤثر على استمراري",
                    value: "worse",
                    score: 4,
                    riskLevel: "high",
                    opensFollowUp: true,
                    nextQuestionId: "continuation_barrier_reason_s3"
                }
            ],

            active: true
        },


        // ==========================================
        // Branch: Continuation Barrier Reason S3
        // ==========================================

        {
            questionId: "continuation_barrier_reason_s3",
            sessionNumber: 3,
            questionSetVersion: 2,

            type: "single",

            category: "risk_detection",

            trackKey: "continuation_barrier_reason",

            text: "ما السبب الذي يجعل الاستمرار في الخطة العلاجية صعبًا بالنسبة لك؟",

            answers: [

                {
                    id: "A1",
                    text: "صعوبة في الالتزام بالمواعيد",
                    value: "appointments",
                    nextQuestionId: "S3-Q07"
                },

                {
                    id: "A2",
                    text: "ضيق الوقت أو الانشغال",
                    value: "time",
                    nextQuestionId: "S3-Q07"
                },

                {
                    id: "A3",
                    text: "صعوبة في تنفيذ التعليمات أو التمارين",
                    value: "execution",
                    nextQuestionId: "S3-Q07"
                },

                {
                    id: "A4",
                    text: "صعوبة في الوصول إلى العيادة أو المواصلات",
                    value: "transportation_access",
                    nextQuestionId: "S3-Q07"
                },

                {
                    id: "A5",
                    text: "ظروف أو مسؤوليات يومية تعيق المتابعة",
                    value: "daily_life",
                    nextQuestionId: "S3-Q07"
                },

                {
                    id: "A6",
                    text: "سبب آخر",
                    value: "other",
                    opensFollowUp: true,
                    nextQuestionId: "continuation_barrier_other_s3"
                }
            ],

            active: true
        },


        // ==========================================
        // Branch: Continuation Barrier Other S3
        // ==========================================

        {
            questionId: "continuation_barrier_other_s3",
            sessionNumber: 3,
            questionSetVersion: 2,

            type: "text",

            category: "risk_detection",

            trackKey: "continuation_barrier_other",

            text: "ما السبب الآخر الذي قد يؤثر على قدرتك على المتابعة؟",

            nextQuestionId: "S3-Q07",

            active: true
        },


        // ==========================================
        // S3-Q07
        // New Problem Detection
        // ==========================================

        {
            questionId: "S3-Q07",
            sessionNumber: 3,
            questionSetVersion: 2,
            order: 5,

            text: "هل ظهرت لديك صعوبة جديدة مختلفة عن المشكلة التي كنا نتابعها؟",

            type: "single",

            category: "patient_state",

            trackKey: "new_problem",

            answers: [

                {
                    id: "A1",
                    text: "لا",
                    value: "none",
                    score: 1,
                    nextQuestionId: "S3-Q08"
                },

                {
                    id: "A2",
                    text: "نعم، ظهرت صعوبة بسيطة",
                    value: "minor",
                    score: 2,
                    opensFollowUp: true,
                    nextQuestionId: "S3-Q07-F01"
                },

                {
                    id: "A3",
                    text: "نعم، ظهرت صعوبة واضحة",
                    value: "clear",
                    score: 3,
                    riskLevel: "medium",
                    opensFollowUp: true,
                    nextQuestionId: "S3-Q07-F01"
                },

                {
                    id: "A4",
                    text: "نعم، ظهرت صعوبة كبيرة",
                    value: "major",
                    score: 4,
                    riskLevel: "high",
                    opensFollowUp: true,
                    nextQuestionId: "S3-Q07-F01"
                }
            ],

            active: true
        },


        // ==========================================
        // S3-Q07-F01
        // New Problem Details
        // ==========================================

        {
            questionId: "S3-Q07-F01",
            sessionNumber: 3,
            questionSetVersion: 2,
            order: 5.1,

            text: "ما الصعوبة الجديدة التي ظهرت لديك؟",

            type: "text",

            category: "patient_state",

            trackKey: "new_problem_details",

            dependsOn: {

                questionId: "S3-Q07",

                answerValues: [
                    "minor",
                    "clear",
                    "major"
                ]
            },

            required: true,

            active: true,

            nextQuestionId: "S3-Q08"
        },


        // ==========================================
        // S3-Q08
        // Patient Feedback
        // ==========================================

        {
            questionId: "S3-Q08",
            sessionNumber: 3,
            questionSetVersion: 2,
            order: 6,

            text: "هل هناك شيء آخر مهم تريد أن يعرفه الفريق المعالج عن حالتك الآن؟",

            type: "text",

            category: "patient_feedback",

            trackKey: "patient_feedback",

            active: true,

            nextQuestionId: null
        }

    ],



// =====================================================
// SESSION 4
// =====================================================


    // =========================================================
    // SESSION 4
    // =========================================================

    session4: [

        // ==========================================
        // S4-Q01
        // Main Problem
        // ==========================================

        {
            questionId: "S4-Q01",
            sessionNumber: 4,
            questionSetVersion: 2,
            order: 1,

            text: "مقارنة بالجلسة السابقة، كيف ترى حالتك الآن؟",

            type: "single",

            category: "patient_state",

            trackKey: "main_problem",

            answers: [

                {
                    id: "A1",
                    text: "أشعر بتحسن واضح",
                    value: "much_better",
                    score: 1,
                    nextQuestionId: "S4-Q02"
                },

                {
                    id: "A2",
                    text: "أشعر بتحسن بسيط",
                    value: "better",
                    score: 2,
                    nextQuestionId: "S4-Q02"
                },

                {
                    id: "A3",
                    text: "لم ألاحظ تغيرًا واضحًا",
                    value: "same",
                    score: 3,
                    riskLevel: "medium",
                    nextQuestionId: "S4-Q02"
                },

                {
                    id: "A4",
                    text: "أشعر أن حالتي أصبحت أسوأ",
                    value: "worse",
                    score: 4,
                    riskLevel: "high",
                    nextQuestionId: "S4-Q02"
                }
            ],

            active: true
        },


        // ==========================================
        // S4-Q02
        // Daily Impact
        // ==========================================

        {
            questionId: "S4-Q02",
            sessionNumber: 4,
            questionSetVersion: 2,
            order: 2,

            text: "مقارنة بالجلسة السابقة، كيف أصبح تأثير حالتك على حياتك اليومية؟",

            type: "single",

            category: "patient_state",

            trackKey: "daily_impact",

            answers: [

                {
                    id: "A1",
                    text: "أصبح أقل بكثير",
                    value: "much_less",
                    score: 1,
                    nextQuestionId: "S4-Q03"
                },

                {
                    id: "A2",
                    text: "أصبح أقل",
                    value: "less",
                    score: 2,
                    nextQuestionId: "S4-Q03"
                },

                {
                    id: "A3",
                    text: "ما زال كما هو تقريبًا",
                    value: "same",
                    score: 3,
                    riskLevel: "medium",
                    nextQuestionId: "S4-Q03"
                },

                {
                    id: "A4",
                    text: "أصبح أكبر من قبل",
                    value: "worse",
                    score: 4,
                    riskLevel: "high",
                    nextQuestionId: "S4-Q03"
                }
            ],

            active: true
        },


        // ==========================================
        // S4-Q03
        // Treatment Difficulty
        // ==========================================

        {
            questionId: "S4-Q03",
            sessionNumber: 4,
            questionSetVersion: 2,
            order: 3,

            text: "مقارنة بالجلسة السابقة، كيف أصبحت قدرتك على تنفيذ الخطة العلاجية؟",

            type: "single",

            category: "treatment_adherence",

            trackKey: "treatment_difficulty",

            answers: [

                {
                    id: "A1",
                    text: "أصبحت أسهل بكثير",
                    value: "much_easier",
                    score: 1,
                    nextQuestionId: "S4-Q05"
                },

                {
                    id: "A2",
                    text: "أصبحت أسهل",
                    value: "easier",
                    score: 2,
                    nextQuestionId: "S4-Q05"
                },

                {
                    id: "A3",
                    text: "لم تتغير وما زالت بنفس الصعوبة تقريبًا",
                    value: "same",
                    score: 3,
                    riskLevel: "medium",
                    nextQuestionId: "S4-Q05"
                },

                {
                    id: "A4",
                    text: "أصبحت أصعب",
                    value: "worse",
                    score: 4,
                    riskLevel: "high",
                    nextQuestionId: "S4-Q05"
                }
            ],

            active: true
        },


        // ==========================================
        // S4-Q05
        // Continuation Barrier
        // ==========================================

        {
            questionId: "S4-Q05",
            sessionNumber: 4,
            questionSetVersion: 2,
            order: 4,

            text: "هل واجهت أي شيء جديد جعل متابعة الخطة العلاجية أو تنفيذها أصعب عليك؟",

            type: "single",

            category: "risk_detection",

            trackKey: "continuation_barrier",

            answers: [

                {
                    id: "A1",
                    text: "لا، لم أواجه أي عائق جديد",
                    value: "none",
                    score: 1,
                    nextQuestionId: "S4-Q06"
                },

                {
                    id: "A2",
                    text: "نعم، واجهت صعوبة بسيطة",
                    value: "minor",
                    score: 2,
                    riskLevel: "low",
                    opensFollowUp: true,
                    nextQuestionId: "S4-Q05-F01"
                },

                {
                    id: "A3",
                    text: "نعم، واجهت صعوبة واضحة",
                    value: "clear",
                    score: 3,
                    riskLevel: "medium",
                    opensFollowUp: true,
                    nextQuestionId: "S4-Q05-F01"
                },

                {
                    id: "A4",
                    text: "نعم، أصبحت المتابعة صعبة جدًا بالنسبة لي وقد تؤثر على استمراري",
                    value: "major",
                    score: 4,
                    riskLevel: "high",
                    opensFollowUp: true,
                    nextQuestionId: "S4-Q05-F01"
                }
            ],

            active: true
        },


        // ==========================================
        // S4-Q05-F01
        // Continuation Barrier Reason
        // ==========================================

        {
            questionId: "S4-Q05-F01",
            sessionNumber: 4,
            questionSetVersion: 2,
            order: 4.1,

            text: "ما السبب الذي جعل متابعة الخطة العلاجية أو تنفيذها أصعب عليك؟",

            type: "single",

            category: "risk_detection",

            trackKey: "continuation_barrier_type",

            dependsOn: {

                questionId: "S4-Q05",

                answerValues: [
                    "minor",
                    "clear",
                    "major"
                ]
            },

            answers: [

                {
                    id: "A1",
                    text: "صعوبة في الوصول إلى العيادة أو المواصلات",
                    value: "transportation_access",
                    nextQuestionId: "S4-Q06"
                },

                {
                    id: "A2",
                    text: "العمل أو الدراسة أو ضيق الوقت",
                    value: "work_study_time",
                    nextQuestionId: "S4-Q06"
                },

                {
                    id: "A3",
                    text: "صعوبة في الالتزام بالمواعيد",
                    value: "appointments",
                    nextQuestionId: "S4-Q06"
                },

                {
                    id: "A4",
                    text: "صعوبة في تنفيذ التعليمات أو التمارين",
                    value: "execution",
                    nextQuestionId: "S4-Q06"
                },

                {
                    id: "A5",
                    text: "ظروف شخصية أو عائلية",
                    value: "personal_family",
                    nextQuestionId: "S4-Q06"
                },

                {
                    id: "A6",
                    text: "سبب آخر",
                    value: "other",
                    opensFollowUp: true,
                    nextQuestionId: "S4-Q05-F02"
                }
            ],

            active: true
        },


        // ==========================================
        // S4-Q05-F02
        // Other Barrier
        // ==========================================

        {
            questionId: "S4-Q05-F02",
            sessionNumber: 4,
            questionSetVersion: 2,
            order: 4.2,

            text: "ما السبب الآخر الذي يؤثر على استمرارك في الخطة العلاجية؟",

            type: "text",

            category: "risk_detection",

            trackKey: "continuation_barrier_details",

            dependsOn: {

                questionId: "S4-Q05-F01",

                answerValues: [
                    "other"
                ]
            },

            required: true,

            active: true,

            nextQuestionId: "S4-Q06"
        },


        // ==========================================
        // S4-Q06
        // New Problem Detection
        // ==========================================

        {
            questionId: "S4-Q06",
            sessionNumber: 4,
            questionSetVersion: 2,
            order: 5,

            text: "هل ظهرت لديك مشكلة أو صعوبة أخرى تحتاج إلى متابعة؟",

            type: "single",

            category: "patient_state",

            trackKey: "new_problem",

            answers: [

                {
                    id: "A1",
                    text: "لا، لا توجد مشكلة أخرى حاليًا",
                    value: "none",
                    score: 1,
                    nextQuestionId: "S4-Q07"
                },

                {
                    id: "A2",
                    text: "نعم، توجد صعوبة بسيطة",
                    value: "minor",
                    score: 2,
                    opensFollowUp: true,
                    nextQuestionId: "S4-Q06-F01"
                },

                {
                    id: "A3",
                    text: "نعم، توجد صعوبة واضحة",
                    value: "clear",
                    score: 3,
                    riskLevel: "medium",
                    opensFollowUp: true,
                    nextQuestionId: "S4-Q06-F01"
                },

                {
                    id: "A4",
                    text: "نعم، توجد مشكلة كبيرة تؤثر عليّ",
                    value: "major",
                    score: 4,
                    riskLevel: "high",
                    opensFollowUp: true,
                    nextQuestionId: "S4-Q06-F01"
                }
            ],

            active: true
        },


        // ==========================================
        // S4-Q06-F01
        // New Problem Details
        // ==========================================

        {
            questionId: "S4-Q06-F01",
            sessionNumber: 4,
            questionSetVersion: 2,
            order: 5.1,

            text: "ما المشكلة أو الصعوبة الجديدة التي ظهرت لديك؟",

            type: "text",

            category: "patient_state",

            trackKey: "new_problem_details",

            dependsOn: {

                questionId: "S4-Q06",

                answerValues: [
                    "minor",
                    "clear",
                    "major"
                ]
            },

            required: true,

            active: true,

            nextQuestionId: "S4-Q07"
        },


        // ==========================================
        // S4-Q07
        // Patient Feedback
        // ==========================================

        {
            questionId: "S4-Q07",
            sessionNumber: 4,
            questionSetVersion: 2,
            order: 6,

            text: "هل هناك شيء آخر مهم تريد أن يعرفه الفريق المعالج عن حالتك الآن؟",

            type: "text",

            category: "patient_feedback",

            trackKey: "patient_feedback",

            active: true,

            nextQuestionId: null
        }

    ],



    // =========================================================
    // SESSION 5
    // =========================================================

    session5: [

        // ==========================================
        // S5-Q01
        // Main Problem
        // ==========================================

        {
            questionId: "S5-Q01",
            sessionNumber: 5,
            questionSetVersion: 2,
            order: 1,

            text: "منذ بداية المتابعة وحتى الآن، كيف ترى حالتك بشكل عام؟",

            type: "single",

            category: "patient_state",

            trackKey: "main_problem",

            answers: [

                {
                    id: "A1",
                    text: "أشعر بتحسن واضح",
                    value: "much_better",
                    score: 1,
                    nextQuestionId: "S5-Q02"
                },

                {
                    id: "A2",
                    text: "أشعر بتحسن جزئي",
                    value: "better",
                    score: 2,
                    nextQuestionId: "S5-Q02"
                },

                {
                    id: "A3",
                    text: "لم ألاحظ تغيرًا واضحًا حتى الآن",
                    value: "same",
                    score: 3,
                    riskLevel: "medium",
                    nextQuestionId: "S5-Q02"
                },

                {
                    id: "A4",
                    text: "أشعر أن حالتي أصبحت أسوأ",
                    value: "worse",
                    score: 4,
                    riskLevel: "high",
                    nextQuestionId: "S5-Q02"
                }
            ],

            active: true
        },


        // ==========================================
        // S5-Q02
        // Daily Impact
        // ==========================================

        {
            questionId: "S5-Q02",
            sessionNumber: 5,
            questionSetVersion: 2,
            order: 2,

            text: "منذ بداية المتابعة وحتى الآن، كيف أصبح تأثير المشكلة على حياتك اليومية؟",

            type: "single",

            category: "patient_state",

            trackKey: "daily_impact",

            answers: [

                {
                    id: "A1",
                    text: "أصبح أقل بكثير",
                    value: "much_less",
                    score: 1,
                    nextQuestionId: "S5-Q03"
                },

                {
                    id: "A2",
                    text: "أصبح أقل بشكل واضح",
                    value: "less",
                    score: 2,
                    nextQuestionId: "S5-Q03"
                },

                {
                    id: "A3",
                    text: "ما زال كما هو تقريبًا",
                    value: "same",
                    score: 3,
                    riskLevel: "medium",
                    nextQuestionId: "S5-Q03"
                },

                {
                    id: "A4",
                    text: "أصبح تأثيره أكبر",
                    value: "worse",
                    score: 4,
                    riskLevel: "high",
                    nextQuestionId: "S5-Q03"
                }
            ],

            active: true
        },


        // ==========================================
        // S5-Q03
        // Activity Change
        // ==========================================

        {
            questionId: "S5-Q03",
            sessionNumber: 5,
            questionSetVersion: 2,
            order: 3,

            text: "منذ بداية المتابعة، كيف أصبحت قدرتك على القيام بالأنشطة التي كانت صعبة عليك؟",

            type: "single",

            category: "patient_state",

            trackKey: "activity_change",

            answers: [

                {
                    id: "A1",
                    text: "أصبحت أسهل بشكل واضح",
                    value: "much_easier",
                    score: 1,
                    nextQuestionId: "S5-Q04"
                },

                {
                    id: "A2",
                    text: "أصبحت أسهل قليلًا",
                    value: "easier",
                    score: 2,
                    nextQuestionId: "S5-Q04"
                },

                {
                    id: "A3",
                    text: "ما زالت بنفس الصعوبة",
                    value: "same",
                    score: 3,
                    riskLevel: "medium",
                    nextQuestionId: "S5-Q04"
                },

                {
                    id: "A4",
                    text: "أصبحت أصعب من البداية",
                    value: "worse",
                    score: 4,
                    riskLevel: "high",
                    nextQuestionId: "S5-Q04"
                }
            ],

            active: true
        },


        // ==========================================
        // S5-Q04
        // Treatment Difficulty
        // ==========================================

        {
            questionId: "S5-Q04",
            sessionNumber: 5,
            questionSetVersion: 2,
            order: 4,

            text: "منذ بداية المتابعة، كيف أصبحت قدرتك على الالتزام بالخطة العلاجية؟",

            type: "single",

            category: "treatment_adherence",

            trackKey: "treatment_difficulty",

            answers: [

                {
                    id: "A1",
                    text: "أصبحت أسهل بكثير",
                    value: "much_easier",
                    score: 1,
                    nextQuestionId: "S5-Q05"
                },

                {
                    id: "A2",
                    text: "أصبحت أسهل",
                    value: "easier",
                    score: 2,
                    nextQuestionId: "S5-Q05"
                },

                {
                    id: "A3",
                    text: "لم تتغير",
                    value: "same",
                    score: 3,
                    riskLevel: "medium",
                    nextQuestionId: "S5-Q05"
                },

                {
                    id: "A4",
                    text: "أصبحت أصعب",
                    value: "worse",
                    score: 4,
                    riskLevel: "high",
                    nextQuestionId: "S5-Q05"
                }
            ],

            active: true
        },


        // ==========================================
        // S5-Q05
        // New Problem Detection
        // ==========================================

        {
            questionId: "S5-Q05",
            sessionNumber: 5,
            questionSetVersion: 2,
            order: 5,

            text: "خلال الفترة الأخيرة، هل ظهرت لديك مشكلة أو صعوبة جديدة غير المشكلة التي كنا نتابعها؟",

            type: "single",

            category: "patient_state",

            trackKey: "new_problem",

            answers: [

                {
                    id: "A1",
                    text: "لا، لم تظهر مشكلة جديدة",
                    value: "none",
                    score: 1,
                    nextQuestionId: "S5-Q06"
                },

                {
                    id: "A2",
                    text: "نعم، ظهرت صعوبة بسيطة",
                    value: "minor",
                    score: 2,
                    opensFollowUp: true,
                    nextQuestionId: "S5-Q05-F01"
                },

                {
                    id: "A3",
                    text: "نعم، ظهرت صعوبة واضحة",
                    value: "clear",
                    score: 3,
                    riskLevel: "medium",
                    opensFollowUp: true,
                    nextQuestionId: "S5-Q05-F01"
                },

                {
                    id: "A4",
                    text: "نعم، ظهرت مشكلة كبيرة تؤثر عليّ",
                    value: "major",
                    score: 4,
                    riskLevel: "high",
                    opensFollowUp: true,
                    nextQuestionId: "S5-Q05-F01"
                }
            ],

            active: true
        },


        // ==========================================
        // S5-Q05-F01
        // New Problem Details
        // ==========================================

        {
            questionId: "S5-Q05-F01",
            sessionNumber: 5,
            questionSetVersion: 2,
            order: 5.1,

            text: "ما المشكلة أو الصعوبة الجديدة التي ظهرت لديك؟",

            type: "text",

            category: "patient_state",

            trackKey: "new_problem_details",

            dependsOn: {

                questionId: "S5-Q05",

                answerValues: [
                    "minor",
                    "clear",
                    "major"
                ]
            },

            required: true,

            active: true,

            nextQuestionId: "S5-Q06"
        },


        // ==========================================
        // S5-Q06
        // Continuation Barrier
        // ==========================================

        {
            questionId: "S5-Q06",
            sessionNumber: 5,
            questionSetVersion: 2,
            order: 6,

            text: "هل هناك أي شيء حاليًا قد يؤثر على استمرارك في الخطة العلاجية؟",

            type: "single",

            category: "risk_detection",

            trackKey: "continuation_barrier",

            answers: [

                {
                    id: "A1",
                    text: "لا يوجد شيء حاليًا",
                    value: "none",
                    score: 1,
                    nextQuestionId: "S5-Q07"
                },

                {
                    id: "A2",
                    text: "هناك صعوبة بسيطة",
                    value: "minor",
                    score: 2,
                    riskLevel: "low",
                    opensFollowUp: true,
                    nextQuestionId: "S5-Q06-F01"
                },

                {
                    id: "A3",
                    text: "هناك صعوبة واضحة",
                    value: "clear",
                    score: 3,
                    riskLevel: "medium",
                    opensFollowUp: true,
                    nextQuestionId: "S5-Q06-F01"
                },

                {
                    id: "A4",
                    text: "هناك مشكلة كبيرة قد تؤثر على استمراري",
                    value: "major",
                    score: 4,
                    riskLevel: "high",
                    opensFollowUp: true,
                    nextQuestionId: "S5-Q06-F01"
                }
            ],

            active: true
        },


        // ==========================================
        // S5-Q06-F01
        // Continuation Barrier Reason
        // ==========================================

        {
            questionId: "S5-Q06-F01",
            sessionNumber: 5,
            questionSetVersion: 2,
            order: 6.1,

            text: "ما السبب الذي يؤثر على استمرارك في الخطة العلاجية؟",

            type: "single",

            category: "risk_detection",

            trackKey: "continuation_barrier_type",

            dependsOn: {

                questionId: "S5-Q06",

                answerValues: [
                    "minor",
                    "clear",
                    "major"
                ]
            },

            answers: [

                {
                    id: "A1",
                    text: "صعوبة في الوصول إلى العيادة أو المواصلات",
                    value: "transportation_access",
                    nextQuestionId: "S5-Q07"
                },

                {
                    id: "A2",
                    text: "العمل أو الدراسة أو ضيق الوقت",
                    value: "work_study_time",
                    nextQuestionId: "S5-Q07"
                },

                {
                    id: "A3",
                    text: "صعوبة في الالتزام بالمواعيد",
                    value: "appointments",
                    nextQuestionId: "S5-Q07"
                },

                {
                    id: "A4",
                    text: "صعوبة في تنفيذ الخطة أو التعليمات",
                    value: "execution",
                    nextQuestionId: "S5-Q07"
                },

                {
                    id: "A5",
                    text: "ظروف شخصية أو عائلية",
                    value: "personal_family",
                    nextQuestionId: "S5-Q07"
                },

                {
                    id: "A6",
                    text: "سبب آخر",
                    value: "other",
                    opensFollowUp: true,
                    nextQuestionId: "S5-Q06-F02"
                }
            ],

            active: true
        },


        // ==========================================
        // S5-Q06-F02
        // Other Barrier
        // ==========================================

        {
            questionId: "S5-Q06-F02",
            sessionNumber: 5,
            questionSetVersion: 2,
            order: 6.2,

            text: "ما السبب الآخر الذي يؤثر على استمرارك في الخطة العلاجية؟",

            type: "text",

            category: "risk_detection",

            trackKey: "continuation_barrier_details",

            dependsOn: {

                questionId: "S5-Q06-F01",

                answerValues: [
                    "other"
                ]
            },

            required: true,

            active: true,

            nextQuestionId: "S5-Q07"
        },


        // ==========================================
        // S5-Q07
        // Patient Feedback
        // ==========================================

        {
            questionId: "S5-Q07",
            sessionNumber: 5,
            questionSetVersion: 2,
            order: 7,

            text: "هل هناك شيء آخر مهم تريد أن يعرفه الفريق المعالج عن حالتك الآن؟",

            type: "text",

            category: "patient_feedback",

            trackKey: "patient_feedback",

            active: true,

            nextQuestionId: null
        }

    ],




// =====================================================
// SESSION 6
// =====================================================
// =====================================================
// SESSION 6 - VERSION 2
// =====================================================

session6: [

    // ==========================================
    // S6-Q01
    // Main Problem
    // ==========================================

    {
        questionId: "S6-Q01",
        sessionNumber: 6,
        order: 1,
        questionSetVersion: 2,

        text: "مقارنة بالجلسة السابقة، كيف ترى حالتك الآن؟",

        type: "single",

        category: "patient_state",

        trackKey: "main_problem",

        answers: [

            {
                id: "A1",
                text: "أشعر بتحسن واضح",
                value: "clear_improvement",
                score: 1,
                nextQuestionId: "S6-Q02"
            },

            {
                id: "A2",
                text: "أشعر بتحسن بسيط",
                value: "slight_improvement",
                score: 2,
                nextQuestionId: "S6-Q02"
            },

            {
                id: "A3",
                text: "لم ألاحظ تغيرًا واضحًا",
                value: "no_clear_change",
                score: 3,
                riskLevel: "medium",
                nextQuestionId: "S6-Q02"
            },

            {
                id: "A4",
                text: "أشعر أن حالتي أصبحت أصعب",
                value: "worse",
                score: 4,
                riskLevel: "high",
                nextQuestionId: "S6-Q02"
            }
        ],

        active: true
    },


    // ==========================================
    // S6-Q02
    // Daily Impact
    // ==========================================

    {
        questionId: "S6-Q02",
        sessionNumber: 6,
        order: 2,
        questionSetVersion: 2,

        text: "مقارنة بالجلسة السابقة، كيف أصبح تأثير المشكلة على حياتك اليومية؟",

        type: "single",

        category: "patient_state",

        trackKey: "daily_impact",

        answers: [

            {
                id: "A1",
                text: "أصبح أقل بكثير",
                value: "much_less",
                score: 1,
                nextQuestionId: "S6-Q03"
            },

            {
                id: "A2",
                text: "أصبح أقل",
                value: "less",
                score: 2,
                nextQuestionId: "S6-Q03"
            },

            {
                id: "A3",
                text: "ما زال كما هو تقريبًا",
                value: "same",
                score: 3,
                riskLevel: "medium",
                nextQuestionId: "S6-Q03"
            },

            {
                id: "A4",
                text: "أصبح أكبر من قبل",
                value: "worse",
                score: 4,
                riskLevel: "high",
                nextQuestionId: "S6-Q03"
            }
        ],

        active: true
    },


    // ==========================================
    // S6-Q03
    // Treatment Difficulty
    // ==========================================

    {
        questionId: "S6-Q03",
        sessionNumber: 6,
        order: 3,
        questionSetVersion: 2,

        text: "مقارنة بالجلسة السابقة، كيف أصبحت قدرتك على تنفيذ الخطة العلاجية؟",

        type: "single",

        category: "treatment_adherence",

        trackKey: "treatment_difficulty",

        answers: [

            {
                id: "A1",
                text: "أصبحت أسهل بكثير",
                value: "much_easier",
                score: 1,
                nextQuestionId: "S6-Q05"
            },

            {
                id: "A2",
                text: "أصبحت أسهل",
                value: "easier",
                score: 2,
                nextQuestionId: "S6-Q05"
            },

            {
                id: "A3",
                text: "لم تتغير وما زالت بنفس الصعوبة تقريبًا",
                value: "same",
                score: 3,
                riskLevel: "medium",
                nextQuestionId: "S6-Q05"
            },

            {
                id: "A4",
                text: "أصبحت أصعب",
                value: "worse",
                score: 4,
                riskLevel: "high",
                nextQuestionId: "S6-Q05"
            }
        ],

        active: true
    },


    // ==========================================
    // S6-Q05
    // New Problem Detection
    // ==========================================

    {
        questionId: "S6-Q05",
        sessionNumber: 6,
        order: 4,
        questionSetVersion: 2,

        text: "هل ظهرت لديك أي صعوبة جديدة مختلفة عن المشكلة التي كنا نتابعها؟",

        type: "single",

        category: "patient_state",

        trackKey: "new_problem",

        answers: [

            {
                id: "A1",
                text: "لا، لم تظهر أي صعوبة جديدة",
                value: "none",
                score: 1,
                nextQuestionId: "S6-Q06"
            },

            {
                id: "A2",
                text: "نعم، ظهرت صعوبة بسيطة",
                value: "minor",
                score: 2,
                riskLevel: "low",
                opensFollowUp: true,
                nextQuestionId: "S6-Q05-F01"
            },

            {
                id: "A3",
                text: "نعم، ظهرت صعوبة واضحة",
                value: "clear",
                score: 3,
                riskLevel: "medium",
                opensFollowUp: true,
                nextQuestionId: "S6-Q05-F01"
            },

            {
                id: "A4",
                text: "نعم، ظهرت صعوبة كبيرة",
                value: "major",
                score: 4,
                riskLevel: "high",
                opensFollowUp: true,
                nextQuestionId: "S6-Q05-F01"
            }
        ],

        active: true
    },


    // ==========================================
    // S6-Q05-F01
    // New Problem Details
    // ==========================================

    {
        questionId: "S6-Q05-F01",
        sessionNumber: 6,
        order: 4.1,
        questionSetVersion: 2,

        text: "ما الصعوبة الجديدة التي ظهرت لديك؟",

        type: "single",

        category: "patient_state",

        trackKey: "new_problem_type",

        dependsOn: {
            questionId: "S6-Q05",
            answerValues: [
                "minor",
                "clear",
                "major"
            ]
        },

        answers: [

            {
                id: "A1",
                text: "صعوبة في تنفيذ الخطة العلاجية",
                value: "treatment_plan",
                nextQuestionId: "S6-Q06"
            },

            {
                id: "A2",
                text: "صعوبة في أداء بعض الأنشطة",
                value: "activity",
                nextQuestionId: "S6-Q06"
            },

            {
                id: "A3",
                text: "ظهور أعراض أو مشكلة أخرى",
                value: "symptoms",
                nextQuestionId: "S6-Q06"
            },

            {
                id: "A4",
                text: "شيء آخر",
                value: "other",
                opensFollowUp: true,
                nextQuestionId: "S6-Q05-F02"
            }
        ],

        active: true
    },


    // ==========================================
    // S6-Q05-F02
    // Other New Problem
    // ==========================================

    {
        questionId: "S6-Q05-F02",
        sessionNumber: 6,
        order: 4.2,
        questionSetVersion: 2,

        text: "ما الشيء الآخر الذي تواجهه؟",

        type: "text",

        category: "patient_state",

        trackKey: "new_problem_details",

        dependsOn: {
            questionId: "S6-Q05-F01",
            answerValues: [
                "other"
            ]
        },

        required: true,

        active: true,

        nextQuestionId: "S6-Q06"
    },


    // ==========================================
    // S6-Q06
    // Continuation Barrier
    // ==========================================

    {
        questionId: "S6-Q06",
        sessionNumber: 6,
        order: 5,
        questionSetVersion: 2,

        text: "هل يوجد شيء حالي قد يجعل الالتزام بالخطة العلاجية أكثر صعوبة؟",

        type: "single",

        category: "risk_detection",

        trackKey: "continuation_barrier",

        answers: [

            {
                id: "A1",
                text: "لا، لا يوجد شيء يؤثر على التزامي بالخطة",
                value: "none",
                score: 1,
                nextQuestionId: "S6-Q07"
            },

            {
                id: "A2",
                text: "نعم، توجد صعوبة بسيطة في الالتزام",
                value: "minor",
                score: 2,
                riskLevel: "low",
                opensFollowUp: true,
                nextQuestionId: "S6-Q06-F01"
            },

            {
                id: "A3",
                text: "نعم، توجد صعوبة واضحة في الالتزام",
                value: "clear",
                score: 3,
                riskLevel: "medium",
                opensFollowUp: true,
                nextQuestionId: "S6-Q06-F01"
            },

            {
                id: "A4",
                text: "نعم، توجد صعوبة كبيرة تجعل الالتزام بالخطة صعبًا جدًا",
                value: "major",
                score: 4,
                riskLevel: "high",
                opensFollowUp: true,
                nextQuestionId: "S6-Q06-F01"
            }
        ],

        active: true
    },


    // ==========================================
    // S6-Q06-F01
    // Continuation Barrier Reason
    // ==========================================

    {
        questionId: "S6-Q06-F01",
        sessionNumber: 6,
        questionSetVersion: 2,
        order: 5.1,

        text: "ما السبب الذي يجعل الالتزام بالخطة العلاجية أكثر صعوبة؟",

        type: "single",

        category: "risk_detection",

        trackKey: "continuation_barrier_type",

        dependsOn: {
            questionId: "S6-Q06",
            answerValues: [
                "minor",
                "clear",
                "major"
            ]
        },

        answers: [

            {
                id: "A1",
                text: "صعوبة في الوصول إلى العيادة أو المواصلات",
                value: "transportation_access",
                nextQuestionId: "S6-Q07"
            },

            {
                id: "A2",
                text: "العمل أو الدراسة أو ضيق الوقت",
                value: "work_study_time",
                nextQuestionId: "S6-Q07"
            },

            {
                id: "A3",
                text: "صعوبة في الالتزام بالمواعيد",
                value: "appointments",
                nextQuestionId: "S6-Q07"
            },

            {
                id: "A4",
                text: "صعوبة في تنفيذ الخطة أو التعليمات",
                value: "execution",
                nextQuestionId: "S6-Q07"
            },

            {
                id: "A5",
                text: "ظروف شخصية أو عائلية",
                value: "personal_family",
                nextQuestionId: "S6-Q07"
            },

            {
                id: "A6",
                text: "سبب آخر",
                value: "other",
                opensFollowUp: true,
                nextQuestionId: "S6-Q06-F02"
            }
        ],

        active: true
    },


    // ==========================================
    // S6-Q06-F02
    // Other Barrier
    // ==========================================

    {
        questionId: "S6-Q06-F02",
        sessionNumber: 6,
        questionSetVersion: 2,
        order: 5.2,

        text: "ما السبب الآخر الذي يؤثر على التزامك بالخطة؟",

        type: "text",

        category: "risk_detection",

        trackKey: "continuation_barrier_details",

        dependsOn: {
            questionId: "S6-Q06-F01",
            answerValues: [
                "other"
            ]
        },

        required: true,

        active: true,

        nextQuestionId: "S6-Q07"
    },


    // ==========================================
    // S6-Q07
    // Patient Feedback
    // ==========================================

    {
        questionId: "S6-Q07",
        sessionNumber: 6,
        order: 6,
        questionSetVersion: 2,

        text: "هل هناك شيء آخر مهم تريد أن يعرفه الفريق المعالج عن حالتك الآن؟",

        type: "text",

        category: "patient_feedback",

        trackKey: "patient_feedback",

        active: true,

        nextQuestionId: null
    }

],



// =====================================================
// SESSION 7 - VERSION 2
// =====================================================

session7: [

    // ==========================================
    // S7-Q01
    // Main Problem
    // ==========================================

    {
        questionId: "S7-Q01",
        sessionNumber: 7,
        order: 1,
        questionSetVersion: 2,

        text: "منذ بداية المتابعة وحتى الآن، كيف ترى حالتك بشكل عام؟",

        type: "single",

        category: "patient_state",

        trackKey: "main_problem",

        answers: [

            {
                id: "A1",
                text: "أشعر بتحسن واضح",
                value: "clear_improvement",
                score: 1,
                nextQuestionId: "S7-Q02"
            },

            {
                id: "A2",
                text: "أشعر بتحسن جزئي",
                value: "partial_improvement",
                score: 2,
                nextQuestionId: "S7-Q02"
            },

            {
                id: "A3",
                text: "لم ألاحظ تغيرًا واضحًا",
                value: "no_clear_change",
                score: 3,
                riskLevel: "medium",
                nextQuestionId: "S7-Q02"
            },

            {
                id: "A4",
                text: "أشعر أن حالتي أصبحت أسوأ",
                value: "worse",
                score: 4,
                riskLevel: "high",
                nextQuestionId: "S7-Q02"
            }
        ],

        active: true
    },


    // ==========================================
    // S7-Q02
    // Daily Impact
    // ==========================================

    {
        questionId: "S7-Q02",
        sessionNumber: 7,
        order: 2,
        questionSetVersion: 2,

        text: "منذ بداية المتابعة وحتى الآن، كيف أصبح تأثير المشكلة على حياتك اليومية؟",

        type: "single",

        category: "patient_state",

        trackKey: "daily_impact",

        answers: [

            {
                id: "A1",
                text: "أصبح أقل بكثير",
                value: "much_less",
                score: 1,
                nextQuestionId: "S7-Q03"
            },

            {
                id: "A2",
                text: "أصبح أقل",
                value: "less",
                score: 2,
                nextQuestionId: "S7-Q03"
            },

            {
                id: "A3",
                text: "ما زال كما هو تقريبًا",
                value: "same",
                score: 3,
                riskLevel: "medium",
                nextQuestionId: "S7-Q03"
            },

            {
                id: "A4",
                text: "أصبح أكبر من قبل",
                value: "worse",
                score: 4,
                riskLevel: "high",
                nextQuestionId: "S7-Q03"
            }
        ],

        active: true
    },


    // ==========================================
    // S7-Q03
    // Activity Change
    // ==========================================

    {
        questionId: "S7-Q03",
        sessionNumber: 7,
        order: 3,
        questionSetVersion: 2,

        text: "منذ بداية المتابعة وحتى الآن، كيف أصبحت قدرتك على أداء الأنشطة التي كانت صعبة عليك؟",

        type: "single",

        category: "patient_state",

        trackKey: "activity_change",

        answers: [

            {
                id: "A1",
                text: "أصبحت أسهل بكثير",
                value: "much_easier",
                score: 1,
                nextQuestionId: "S7-Q04"
            },

            {
                id: "A2",
                text: "أصبحت أسهل",
                value: "easier",
                score: 2,
                nextQuestionId: "S7-Q04"
            },

            {
                id: "A3",
                text: "ما زالت بنفس الصعوبة",
                value: "same",
                score: 3,
                riskLevel: "medium",
                nextQuestionId: "S7-Q04"
            },

            {
                id: "A4",
                text: "أصبحت أصعب",
                value: "worse",
                score: 4,
                riskLevel: "high",
                nextQuestionId: "S7-Q04"
            }
        ],

        active: true
    },


    // ==========================================
    // S7-Q04
    // Treatment Difficulty
    // ==========================================

    {
        questionId: "S7-Q04",
        sessionNumber: 7,
        order: 4,
        questionSetVersion: 2,

        text: "منذ بداية المتابعة وحتى الآن، كيف أصبحت قدرتك على الالتزام بالخطة العلاجية؟",

        type: "single",

        category: "treatment_adherence",

        trackKey: "treatment_difficulty",

        answers: [

            {
                id: "A1",
                text: "أصبحت أسهل بكثير",
                value: "much_easier",
                score: 1,
                nextQuestionId: "S7-Q06"
            },

            {
                id: "A2",
                text: "أصبحت أسهل",
                value: "easier",
                score: 2,
                nextQuestionId: "S7-Q06"
            },

            {
                id: "A3",
                text: "ما زالت كما هي",
                value: "same",
                score: 3,
                riskLevel: "medium",
                nextQuestionId: "S7-Q06"
            },

            {
                id: "A4",
                text: "أصبحت أصعب",
                value: "worse",
                score: 4,
                riskLevel: "high",
                nextQuestionId: "S7-Q06"
            }
        ],

        active: true
    },


    // ==========================================
    // S7-Q06
    // New Problem Detection
    // ==========================================

    {
        questionId: "S7-Q06",
        sessionNumber: 7,
        order: 5,
        questionSetVersion: 2,

        text: "هل ظهرت لديك أي صعوبة جديدة تحتاج إلى متابعة؟",

        type: "single",

        category: "patient_state",

        trackKey: "new_problem",

        answers: [

            {
                id: "A1",
                text: "لا، لم تظهر أي صعوبة جديدة",
                value: "none",
                score: 1,
                nextQuestionId: "S7-Q07"
            },

            {
                id: "A2",
                text: "نعم، ظهرت صعوبة بسيطة",
                value: "minor",
                score: 2,
                riskLevel: "low",
                opensFollowUp: true,
                nextQuestionId: "S7-Q06-F01"
            },

            {
                id: "A3",
                text: "نعم، ظهرت صعوبة واضحة",
                value: "clear",
                score: 3,
                riskLevel: "medium",
                opensFollowUp: true,
                nextQuestionId: "S7-Q06-F01"
            },

            {
                id: "A4",
                text: "نعم، ظهرت مشكلة كبيرة تؤثر عليّ",
                value: "major",
                score: 4,
                riskLevel: "high",
                opensFollowUp: true,
                nextQuestionId: "S7-Q06-F01"
            }
        ],

        active: true
    },


    // ==========================================
    // S7-Q06-F01
    // New Problem Details
    // ==========================================

    {
        questionId: "S7-Q06-F01",
        sessionNumber: 7,
        order: 5.1,
        questionSetVersion: 2,

        text: "ما الصعوبة الجديدة التي ظهرت لديك؟",

        type: "single",

        category: "patient_state",

        trackKey: "new_problem_type",

        dependsOn: {
            questionId: "S7-Q06",
            answerValues: [
                "minor",
                "clear",
                "major"
            ]
        },

        answers: [

            {
                id: "A1",
                text: "صعوبة في تنفيذ الخطة العلاجية",
                value: "treatment_plan",
                nextQuestionId: "S7-Q07"
            },

            {
                id: "A2",
                text: "صعوبة في أداء بعض الأنشطة",
                value: "activity",
                nextQuestionId: "S7-Q07"
            },

            {
                id: "A3",
                text: "ظهور أعراض أو مشكلة أخرى",
                value: "symptoms",
                nextQuestionId: "S7-Q07"
            },

            {
                id: "A4",
                text: "شيء آخر",
                value: "other",
                opensFollowUp: true,
                nextQuestionId: "S7-Q06-F02"
            }
        ],

        active: true
    },


    // ==========================================
    // S7-Q06-F02
    // Other New Problem
    // ==========================================

    {
        questionId: "S7-Q06-F02",
        sessionNumber: 7,
        order: 5.2,
        questionSetVersion: 2,

        text: "ما الشيء الآخر الذي تواجهه؟",

        type: "text",

        category: "patient_state",

        trackKey: "new_problem_details",

        dependsOn: {
            questionId: "S7-Q06-F01",
            answerValues: [
                "other"
            ]
        },

        required: true,

        active: true,

        nextQuestionId: "S7-Q07"
    },


    // ==========================================
    // S7-Q07
    // Continuation Barrier
    // ==========================================

    {
        questionId: "S7-Q07",
        sessionNumber: 7,
        order: 6,
        questionSetVersion: 2,

        text: "هل يوجد شيء حالي قد يجعل الالتزام بالخطة العلاجية أكثر صعوبة؟",

        type: "single",

        category: "risk_detection",

        trackKey: "continuation_barrier",

        answers: [

            {
                id: "A1",
                text: "لا، لا يوجد شيء يؤثر على التزامي بالخطة",
                value: "none",
                score: 1,
                nextQuestionId: "S7-Q08"
            },

            {
                id: "A2",
                text: "نعم، توجد صعوبة بسيطة في الالتزام",
                value: "minor",
                score: 2,
                riskLevel: "low",
                opensFollowUp: true,
                nextQuestionId: "S7-Q07-F01"
            },

            {
                id: "A3",
                text: "نعم، توجد صعوبة واضحة في الالتزام",
                value: "clear",
                score: 3,
                riskLevel: "medium",
                opensFollowUp: true,
                nextQuestionId: "S7-Q07-F01"
            },

            {
                id: "A4",
                text: "نعم، توجد صعوبة كبيرة تجعل الالتزام بالخطة صعبًا جدًا",
                value: "major",
                score: 4,
                riskLevel: "high",
                opensFollowUp: true,
                nextQuestionId: "S7-Q07-F01"
            }
        ],

        active: true
    },


    // ==========================================
    // S7-Q07-F01
    // Continuation Barrier Reason
    // ==========================================

    {
        questionId: "S7-Q07-F01",
        sessionNumber: 7,
        questionSetVersion: 2,
        order: 6.1,

        text: "ما السبب الذي يجعل الالتزام بالخطة العلاجية أكثر صعوبة؟",

        type: "single",

        category: "risk_detection",

        trackKey: "continuation_barrier_type",

        dependsOn: {
            questionId: "S7-Q07",
            answerValues: [
                "minor",
                "clear",
                "major"
            ]
        },

        answers: [

            {
                id: "A1",
                text: "صعوبة في الوصول إلى العيادة أو المواصلات",
                value: "transportation_access",
                nextQuestionId: "S7-Q08"
            },

            {
                id: "A2",
                text: "العمل أو الدراسة أو ضيق الوقت",
                value: "work_study_time",
                nextQuestionId: "S7-Q08"
            },

            {
                id: "A3",
                text: "صعوبة في الالتزام بالمواعيد",
                value: "appointments",
                nextQuestionId: "S7-Q08"
            },

            {
                id: "A4",
                text: "صعوبة في تنفيذ الخطة أو التعليمات",
                value: "execution",
                nextQuestionId: "S7-Q08"
            },

            {
                id: "A5",
                text: "ظروف شخصية أو عائلية",
                value: "personal_family",
                nextQuestionId: "S7-Q08"
            },

            {
                id: "A6",
                text: "سبب آخر",
                value: "other",
                opensFollowUp: true,
                nextQuestionId: "S7-Q07-F02"
            }
        ],

        active: true
    },


    // ==========================================
    // S7-Q07-F02
    // Other Barrier
    // ==========================================

    {
        questionId: "S7-Q07-F02",
        sessionNumber: 7,
        questionSetVersion: 2,
        order: 6.2,

        text: "ما السبب الآخر الذي يؤثر على التزامك بالخطة؟",

        type: "text",

        category: "risk_detection",

        trackKey: "continuation_barrier_details",

        dependsOn: {
            questionId: "S7-Q07-F01",
            answerValues: [
                "other"
            ]
        },

        required: true,

        active: true,

        nextQuestionId: "S7-Q08"
    },


    // ==========================================
    // S7-Q08
    // Patient Feedback
    // ==========================================

    {
        questionId: "S7-Q08",
        sessionNumber: 7,
        questionSetVersion: 2,
        order: 7,

        text: "هل هناك شيء آخر مهم تريد أن يعرفه الفريق المعالج عن حالتك الآن؟",

        type: "text",

        category: "patient_feedback",

        trackKey: "patient_feedback",

        active: true,

        nextQuestionId: null
    }

],

// =====================================================
// SESSION 8
// =====================================================


    // =====================================================
    // SESSION 8
    // VERSION 2
    // =====================================================

    session8: [

        // ==========================================
        // S8-Q01
        // Main Problem
        // ==========================================

        {
            questionId: "S8-Q01",
            sessionNumber: 8,
            order: 1,
            questionSetVersion: 2,

            text: "مقارنة بالجلسة السابقة، كيف ترى حالتك الآن؟",

            type: "single",

            category: "patient_state",

            trackKey: "main_problem",

            answers: [

                {
                    id: "A1",
                    text: "أشعر بتحسن واضح",
                    value: "clear_improvement",
                    score: 1,
                    nextQuestionId: "S8-Q02"
                },

                {
                    id: "A2",
                    text: "أشعر بتحسن بسيط",
                    value: "slight_improvement",
                    score: 2,
                    nextQuestionId: "S8-Q02"
                },

                {
                    id: "A3",
                    text: "لم ألاحظ تغيرًا واضحًا",
                    value: "same",
                    score: 3,
                    riskLevel: "medium",
                    nextQuestionId: "S8-Q02"
                },

                {
                    id: "A4",
                    text: "أشعر أن حالتي أصبحت أصعب",
                    value: "worse",
                    score: 4,
                    riskLevel: "high",
                    nextQuestionId: "S8-Q02"
                }
            ],

            active: true
        },


        // ==========================================
        // S8-Q02
        // Daily Impact
        // ==========================================

        {
            questionId: "S8-Q02",
            sessionNumber: 8,
            order: 2,
            questionSetVersion: 2,

            text: "مقارنة بالجلسة السابقة، كيف أصبح تأثير حالتك على حياتك اليومية؟",

            type: "single",

            category: "patient_state",

            trackKey: "daily_impact",

            answers: [

                {
                    id: "A1",
                    text: "أصبح أقل بكثير",
                    value: "much_less",
                    score: 1,
                    nextQuestionId: "S8-Q03"
                },

                {
                    id: "A2",
                    text: "أصبح أقل",
                    value: "less",
                    score: 2,
                    nextQuestionId: "S8-Q03"
                },

                {
                    id: "A3",
                    text: "ما زال كما هو تقريبًا",
                    value: "same",
                    score: 3,
                    riskLevel: "medium",
                    nextQuestionId: "S8-Q03"
                },

                {
                    id: "A4",
                    text: "أصبح أكبر من قبل",
                    value: "worse",
                    score: 4,
                    riskLevel: "high",
                    nextQuestionId: "S8-Q03"
                }
            ],

            active: true
        },


        // ==========================================
        // S8-Q03
        // Treatment Difficulty
        // ==========================================

        {
            questionId: "S8-Q03",
            sessionNumber: 8,
            order: 3,
            questionSetVersion: 2,

            text: "مقارنة بالجلسة السابقة، كيف أصبح التزامك بالخطة العلاجية؟",

            type: "single",

            category: "treatment_adherence",

            trackKey: "treatment_difficulty",

            answers: [

                {
                    id: "A1",
                    text: "أصبح أسهل بكثير وألتزم بالخطة بشكل جيد",
                    value: "much_better",
                    score: 1,
                    nextQuestionId: "S8-Q04"
                },

                {
                    id: "A2",
                    text: "أصبح أسهل وألتزم بها بشكل أفضل",
                    value: "better",
                    score: 2,
                    nextQuestionId: "S8-Q04"
                },

                {
                    id: "A3",
                    text: "ما زالت لدي بعض الصعوبة في الالتزام",
                    value: "same",
                    score: 3,
                    riskLevel: "medium",
                    nextQuestionId: "S8-Q04"
                },

                {
                    id: "A4",
                    text: "أصبحت لدي صعوبة أكبر في الالتزام بالخطة",
                    value: "worse",
                    score: 4,
                    riskLevel: "high",
                    nextQuestionId: "S8-Q04"
                }
            ],

            active: true
        },


        // ==========================================
        // S8-Q04
        // Activity Change
        // ==========================================

        {
            questionId: "S8-Q04",
            sessionNumber: 8,
            order: 4,
            questionSetVersion: 2,

            text: "مقارنة بالجلسة السابقة، كيف أصبحت قدرتك على أداء الأنشطة التي كانت صعبة عليك؟",

            type: "single",

            category: "patient_state",

            trackKey: "activity_change",

            answers: [

                {
                    id: "A1",
                    text: "أصبحت أسهل بشكل واضح",
                    value: "much_easier",
                    score: 1,
                    nextQuestionId: "S8-Q05"
                },

                {
                    id: "A2",
                    text: "أصبحت أسهل قليلًا",
                    value: "easier",
                    score: 2,
                    nextQuestionId: "S8-Q05"
                },

                {
                    id: "A3",
                    text: "ما زالت بنفس الصعوبة",
                    value: "same",
                    score: 3,
                    riskLevel: "medium",
                    nextQuestionId: "S8-Q05"
                },

                {
                    id: "A4",
                    text: "أصبحت أصعب من قبل",
                    value: "worse",
                    score: 4,
                    riskLevel: "high",
                    nextQuestionId: "S8-Q05"
                }
            ],

            active: true
        },


        // ==========================================
        // S8-Q05
        // Continuation Barrier
        // ==========================================

        {
            questionId: "S8-Q05",
            sessionNumber: 8,
            order: 5,
            questionSetVersion: 2,

            text: "هل واجهت أي شيء جديد جعل الالتزام بالخطة العلاجية أصعب عليك؟",

            type: "single",

            category: "risk_detection",

            trackKey: "continuation_barrier",

            answers: [

                {
                    id: "A1",
                    text: "لا، لم أواجه أي عائق جديد",
                    value: "none",
                    score: 1,
                    nextQuestionId: "S8-Q06"
                },

                {
                    id: "A2",
                    text: "نعم، واجهت صعوبة بسيطة",
                    value: "minor",
                    score: 2,
                    riskLevel: "low",
                    opensFollowUp: true,
                    nextQuestionId: "S8-Q05-F01"
                },

                {
                    id: "A3",
                    text: "نعم، واجهت صعوبة واضحة",
                    value: "clear",
                    score: 3,
                    riskLevel: "medium",
                    opensFollowUp: true,
                    nextQuestionId: "S8-Q05-F01"
                },

                {
                    id: "A4",
                    text: "نعم، أصبحت لدي مشكلة كبيرة تؤثر على التزامي بالخطة",
                    value: "major",
                    score: 4,
                    riskLevel: "high",
                    opensFollowUp: true,
                    nextQuestionId: "S8-Q05-F01"
                }
            ],

            active: true
        },


        // ==========================================
        // S8-Q05-F01
        // Continuation Barrier Reason
        // ==========================================

        {
            questionId: "S8-Q05-F01",
            sessionNumber: 8,
            questionSetVersion: 2,
            order: 5.1,

            text: "ما السبب الذي جعل الالتزام بالخطة العلاجية أصعب عليك؟",

            type: "single",

            category: "risk_detection",

            trackKey: "continuation_barrier_type",

            dependsOn: {
                questionId: "S8-Q05",
                answerValues: [
                    "minor",
                    "clear",
                    "major"
                ]
            },

            answers: [

                {
                    id: "A1",
                    text: "العمل أو الدراسة أو ضيق الوقت",
                    value: "work_study_time",
                    nextQuestionId: "S8-Q06"
                },

                {
                    id: "A2",
                    text: "صعوبة في الوصول إلى العيادة أو المواصلات",
                    value: "transportation_access",
                    nextQuestionId: "S8-Q06"
                },

                {
                    id: "A3",
                    text: "صعوبة في الالتزام بالمواعيد",
                    value: "appointments",
                    nextQuestionId: "S8-Q06"
                },

                {
                    id: "A4",
                    text: "صعوبة في تنفيذ الخطة أو التعليمات",
                    value: "execution",
                    nextQuestionId: "S8-Q06"
                },

                {
                    id: "A5",
                    text: "ظروف شخصية أو عائلية",
                    value: "personal_family",
                    nextQuestionId: "S8-Q06"
                },

                {
                    id: "A6",
                    text: "سبب آخر",
                    value: "other",
                    opensFollowUp: true,
                    nextQuestionId: "S8-Q05-F02"
                }
            ],

            active: true
        },


        // ==========================================
        // S8-Q05-F02
        // Other Barrier
        // ==========================================

        {
            questionId: "S8-Q05-F02",
            sessionNumber: 8,
            questionSetVersion: 2,
            order: 5.2,

            text: "ما السبب الآخر الذي يؤثر على التزامك بالخطة؟",

            type: "text",

            category: "risk_detection",

            trackKey: "continuation_barrier_details",

            dependsOn: {
                questionId: "S8-Q05-F01",
                answerValues: [
                    "other"
                ]
            },

            required: true,

            active: true,

            nextQuestionId: "S8-Q06"
        },


        // ==========================================
        // S8-Q06
        // Remaining Concern
        // ==========================================

        {
            questionId: "S8-Q06",
            sessionNumber: 8,
            order: 6,
            questionSetVersion: 2,

            text: "هل هناك شيء في حالتك الحالية تشعر أنه ما زال يحتاج إلى اهتمام أكبر؟",

            type: "single",

            category: "patient_state",

            trackKey: "remaining_concern",

            answers: [

                {
                    id: "A1",
                    text: "لا، أشعر أن الأمور تسير بشكل جيد",
                    value: "none",
                    score: 1,
                    nextQuestionId: "S8-Q07"
                },

                {
                    id: "A2",
                    text: "نعم، هناك شيء بسيط يحتاج إلى تحسين",
                    value: "minor",
                    score: 2,
                    riskLevel: "low",
                    nextQuestionId: "S8-Q07"
                },

                {
                    id: "A3",
                    text: "نعم، هناك شيء واضح ما زال يسبب لي صعوبة",
                    value: "clear",
                    score: 3,
                    riskLevel: "medium",
                    nextQuestionId: "S8-Q07"
                },

                {
                    id: "A4",
                    text: "نعم، هناك مشكلة كبيرة ما زالت تؤثر عليّ",
                    value: "major",
                    score: 4,
                    riskLevel: "high",
                    nextQuestionId: "S8-Q07"
                }
            ],

            active: true
        },


        // ==========================================
        // S8-Q07
        // Patient Feedback
        // ==========================================

        {
            questionId: "S8-Q07",
            sessionNumber: 8,
            order: 7,
            questionSetVersion: 2,

            text: "هل هناك شيء آخر مهم تريد أن يعرفه الفريق المعالج عن حالتك الآن؟",

            type: "text",

            category: "patient_feedback",

            trackKey: "patient_feedback",

            active: true,

            nextQuestionId: null
        }

    ],



    // =====================================================
    // SESSION 9
    // VERSION 2
    // =====================================================

    session9: [

        // ==========================================
        // S9-Q01
        // Main Problem
        // ==========================================

        {
            questionId: "S9-Q01",
            sessionNumber: 9,
            order: 1,
            questionSetVersion: 2,

            text: "مقارنة بالجلسة السابقة، كيف ترى حالتك الآن؟",

            type: "single",

            category: "patient_state",

            trackKey: "main_problem",

            answers: [

                {
                    id: "A1",
                    text: "أشعر بتحسن واضح",
                    value: "clear_improvement",
                    score: 1,
                    nextQuestionId: "S9-Q03"
                },

                {
                    id: "A2",
                    text: "أشعر بتحسن بسيط",
                    value: "slight_improvement",
                    score: 2,
                    nextQuestionId: "S9-Q03"
                },

                {
                    id: "A3",
                    text: "لم ألاحظ تغيرًا واضحًا",
                    value: "same",
                    score: 3,
                    riskLevel: "medium",
                    nextQuestionId: "S9-Q03"
                },

                {
                    id: "A4",
                    text: "أشعر أن حالتي أصبحت أصعب",
                    value: "worse",
                    score: 4,
                    riskLevel: "high",
                    nextQuestionId: "S9-Q03"
                }
            ],

            active: true
        },


        // ==========================================
        // S9-Q03
        // Daily Impact
        // ==========================================

        {
            questionId: "S9-Q03",
            sessionNumber: 9,
            order: 2,
            questionSetVersion: 2,

            text: "كيف أصبحت قدرتك على ممارسة أنشطتك اليومية مقارنة ببداية المتابعة؟",

            type: "single",

            category: "patient_state",

            trackKey: "daily_impact",

            answers: [

                {
                    id: "A1",
                    text: "أصبحت أفضل بشكل واضح",
                    value: "much_better",
                    score: 1,
                    nextQuestionId: "S9-Q04"
                },

                {
                    id: "A2",
                    text: "أصبحت أفضل قليلًا",
                    value: "better",
                    score: 2,
                    nextQuestionId: "S9-Q04"
                },

                {
                    id: "A3",
                    text: "لم تتغير بشكل واضح",
                    value: "same",
                    score: 3,
                    riskLevel: "medium",
                    nextQuestionId: "S9-Q04"
                },

                {
                    id: "A4",
                    text: "أصبحت أصعب من قبل",
                    value: "worse",
                    score: 4,
                    riskLevel: "high",
                    nextQuestionId: "S9-Q04"
                }
            ],

            active: true
        },


        // ==========================================
        // S9-Q04
        // Treatment Difficulty
        // ==========================================

        {
            questionId: "S9-Q04",
            sessionNumber: 9,
            order: 3,
            questionSetVersion: 2,

            text: "كيف ترى التزامك بالخطة العلاجية مقارنة ببداية المتابعة؟",

            type: "single",

            category: "treatment_adherence",

            trackKey: "treatment_difficulty",

            answers: [

                {
                    id: "A1",
                    text: "أصبحت ألتزم بها بشكل أفضل بكثير",
                    value: "much_better",
                    score: 1,
                    nextQuestionId: "S9-Q05"
                },

                {
                    id: "A2",
                    text: "أصبحت ألتزم بها بشكل أفضل",
                    value: "better",
                    score: 2,
                    nextQuestionId: "S9-Q05"
                },

                {
                    id: "A3",
                    text: "لم يتغير مستوى التزامي بشكل واضح",
                    value: "same",
                    score: 3,
                    riskLevel: "medium",
                    nextQuestionId: "S9-Q05"
                },

                {
                    id: "A4",
                    text: "أصبحت أواجه صعوبة أكبر في الالتزام",
                    value: "worse",
                    score: 4,
                    riskLevel: "high",
                    nextQuestionId: "S9-Q05"
                }
            ],

            active: true
        },


        // ==========================================
        // S9-Q05
        // Continuation Barrier
        // ==========================================

        {
            questionId: "S9-Q05",
            sessionNumber: 9,
            order: 4,
            questionSetVersion: 2,

            text: "هل يوجد حاليًا أي عائق قد يؤثر على التزامك بالخطة العلاجية؟",

            type: "single",

            category: "risk_detection",

            trackKey: "continuation_barrier",

            answers: [

                {
                    id: "A1",
                    text: "لا يوجد أي عائق حاليًا",
                    value: "none",
                    score: 1,
                    nextQuestionId: "S9-Q06"
                },

                {
                    id: "A2",
                    text: "نعم، يوجد عائق بسيط",
                    value: "minor",
                    score: 2,
                    riskLevel: "low",
                    opensFollowUp: true,
                    nextQuestionId: "S9-Q05-F01"
                },

                {
                    id: "A3",
                    text: "نعم، يوجد عائق واضح",
                    value: "clear",
                    score: 3,
                    riskLevel: "medium",
                    opensFollowUp: true,
                    nextQuestionId: "S9-Q05-F01"
                },

                {
                    id: "A4",
                    text: "نعم، يوجد عائق كبير يجعل الالتزام بالخطة صعبًا جدًا",
                    value: "major",
                    score: 4,
                    riskLevel: "high",
                    opensFollowUp: true,
                    nextQuestionId: "S9-Q05-F01"
                }
            ],

            active: true
        },


        // ==========================================
        // S9-Q05-F01
        // Continuation Barrier Reason
        // ==========================================

        {
            questionId: "S9-Q05-F01",
            sessionNumber: 9,
            order: 4.1,
            questionSetVersion: 2,

            text: "ما السبب الذي يؤثر على التزامك بالخطة العلاجية؟",

            type: "single",

            category: "risk_detection",

            trackKey: "continuation_barrier_type",

            dependsOn: {
                questionId: "S9-Q05",
                answerValues: [
                    "minor",
                    "clear",
                    "major"
                ]
            },

            answers: [

                {
                    id: "A1",
                    text: "العمل أو الدراسة أو ضيق الوقت",
                    value: "work_study_time",
                    nextQuestionId: "S9-Q06"
                },

                {
                    id: "A2",
                    text: "صعوبة في الوصول إلى العيادة أو المواصلات",
                    value: "transportation_access",
                    nextQuestionId: "S9-Q06"
                },

                {
                    id: "A3",
                    text: "صعوبة في الالتزام بالمواعيد",
                    value: "appointments",
                    nextQuestionId: "S9-Q06"
                },

                {
                    id: "A4",
                    text: "صعوبة في تنفيذ الخطة العلاجية",
                    value: "treatment_difficulty",
                    nextQuestionId: "S9-Q06"
                },

                {
                    id: "A5",
                    text: "ظرف شخصي أو عائلي",
                    value: "personal_family",
                    nextQuestionId: "S9-Q06"
                },

                {
                    id: "A6",
                    text: "سبب آخر",
                    value: "other",
                    opensFollowUp: true,
                    nextQuestionId: "S9-Q05-F02"
                }
            ],

            active: true
        },


        // ==========================================
        // S9-Q05-F02
        // Other Barrier
        // ==========================================

        {
            questionId: "S9-Q05-F02",
            sessionNumber: 9,
            order: 4.2,
            questionSetVersion: 2,

            text: "ما الشيء الآخر الذي يؤثر على التزامك بالخطة؟",

            type: "text",

            category: "risk_detection",

            trackKey: "continuation_barrier_details",

            dependsOn: {
                questionId: "S9-Q05-F01",
                answerValues: [
                    "other"
                ]
            },

            required: true,

            active: true,

            nextQuestionId: "S9-Q06"
        },


        // ==========================================
        // S9-Q06
        // Remaining Concern
        // ==========================================

        {
            questionId: "S9-Q06",
            sessionNumber: 9,
            order: 5,
            questionSetVersion: 2,

            text: "هل هناك جانب من حالتك ما زال يحتاج إلى اهتمام أكبر قبل الوصول إلى المرحلة النهائية من المتابعة؟",

            type: "single",

            category: "patient_state",

            trackKey: "remaining_concern",

            answers: [

                {
                    id: "A1",
                    text: "لا، أشعر أن الأمور تسير بشكل جيد",
                    value: "none",
                    score: 1,
                    nextQuestionId: "S9-Q07"
                },

                {
                    id: "A2",
                    text: "نعم، هناك جانب بسيط يحتاج إلى تحسين",
                    value: "minor",
                    score: 2,
                    riskLevel: "low",
                    nextQuestionId: "S9-Q07"
                },

                {
                    id: "A3",
                    text: "نعم، هناك جانب واضح ما زال يسبب لي صعوبة",
                    value: "clear",
                    score: 3,
                    riskLevel: "medium",
                    nextQuestionId: "S9-Q07"
                },

                {
                    id: "A4",
                    text: "نعم، هناك جانب كبير ما زال يؤثر على حالتي",
                    value: "major",
                    score: 4,
                    riskLevel: "high",
                    nextQuestionId: "S9-Q07"
                }
            ],

            active: true
        },


        // ==========================================
        // S9-Q07
        // New Problem Detection
        // ==========================================

        {
            questionId: "S9-Q07",
            sessionNumber: 9,
            order: 6,
            questionSetVersion: 2,

            text: "هل ظهرت لديك مشكلة أو صعوبة جديدة مختلفة عن المشكلة التي كنا نتابعها؟",

            type: "single",

            category: "patient_state",

            trackKey: "new_problem",

            answers: [

                {
                    id: "A1",
                    text: "لا، لم تظهر أي مشكلة جديدة",
                    value: "none",
                    score: 1,
                    nextQuestionId: "S9-Q08"
                },

                {
                    id: "A2",
                    text: "نعم، ظهرت صعوبة بسيطة",
                    value: "minor",
                    score: 2,
                    riskLevel: "low",
                    opensFollowUp: true,
                    nextQuestionId: "S9-Q07-F01"
                },

                {
                    id: "A3",
                    text: "نعم، ظهرت صعوبة واضحة",
                    value: "clear",
                    score: 3,
                    riskLevel: "medium",
                    opensFollowUp: true,
                    nextQuestionId: "S9-Q07-F01"
                },

                {
                    id: "A4",
                    text: "نعم، ظهرت مشكلة كبيرة",
                    value: "major",
                    score: 4,
                    riskLevel: "high",
                    opensFollowUp: true,
                    nextQuestionId: "S9-Q07-F01"
                }
            ],

            active: true
        },


        // ==========================================
        // S9-Q07-F01
        // New Problem Details
        // ==========================================

        {
            questionId: "S9-Q07-F01",
            sessionNumber: 9,
            order: 6.1,
            questionSetVersion: 2,

            text: "ما الصعوبة أو المشكلة الجديدة التي ظهرت لديك؟",

            type: "text",

            category: "patient_state",

            trackKey: "new_problem_details",

            dependsOn: {
                questionId: "S9-Q07",
                answerValues: [
                    "minor",
                    "clear",
                    "major"
                ]
            },

            required: true,

            active: true,

            nextQuestionId: "S9-Q08"
        },


        // ==========================================
        // S9-Q08
        // Patient Feedback
        // ==========================================

        {
            questionId: "S9-Q08",
            sessionNumber: 9,
            order: 7,
            questionSetVersion: 2,

            text: "هل هناك شيء مهم تريد أن يعرفه الفريق المعالج قبل الجلسة القادمة؟",

            type: "text",

            category: "patient_feedback",

            trackKey: "patient_feedback",

            active: true,

            nextQuestionId: null
        }

    ],



// =====================================================
// SESSION 10
// =====================================================
// =====================================================
// SESSION 10
// VERSION 2
// =====================================================

session10: [

    // ==========================================
    // S10-Q01
    // Main Problem
    // ==========================================

    {
        questionId: "S10-Q01",
        sessionNumber: 10,
        order: 1,
        questionSetVersion: 2,

        text: "مقارنة ببداية المتابعة، كيف ترى حالتك الآن؟",

        type: "single",

        category: "patient_state",

        trackKey: "main_problem",

        answers: [

            {
                id: "A1",
                text: "أشعر بتحسن واضح",
                value: "clear_improvement",
                score: 1,
                nextQuestionId: "S10-Q03"
            },

            {
                id: "A2",
                text: "أشعر بتحسن بسيط",
                value: "slight_improvement",
                score: 2,
                nextQuestionId: "S10-Q03"
            },

            {
                id: "A3",
                text: "لم ألاحظ تغيرًا واضحًا",
                value: "same",
                score: 3,
                riskLevel: "medium",
                nextQuestionId: "S10-Q03"
            },

            {
                id: "A4",
                text: "أشعر أن حالتي أصبحت أسوأ من البداية",
                value: "worse",
                score: 4,
                riskLevel: "high",
                nextQuestionId: "S10-Q03"
            }
        ],

        active: true
    },


    // ==========================================
    // S10-Q02
    // ❌ REMOVED
    // ==========================================
    //
    // كان مكررًا مع S10-Q01
    // وكلاهما يستخدم:
    // trackKey: "main_problem"
    //
    // ==========================================


    // ==========================================
    // S10-Q03
    // Daily Impact
    // ==========================================

    {
        questionId: "S10-Q03",
        sessionNumber: 10,
        order: 2,
        questionSetVersion: 2,

        text: "مقارنة ببداية المتابعة، كيف أصبحت قدرتك على ممارسة أنشطتك اليومية؟",

        type: "single",

        category: "patient_state",

        trackKey: "daily_impact",

        answers: [

            {
                id: "A1",
                text: "أصبحت أفضل بشكل واضح",
                value: "much_better",
                score: 1,
                nextQuestionId: "S10-Q04"
            },

            {
                id: "A2",
                text: "أصبحت أفضل قليلًا",
                value: "better",
                score: 2,
                nextQuestionId: "S10-Q04"
            },

            {
                id: "A3",
                text: "لم تتغير بشكل واضح",
                value: "same",
                score: 3,
                riskLevel: "medium",
                nextQuestionId: "S10-Q04"
            },

            {
                id: "A4",
                text: "أصبحت أصعب من قبل",
                value: "worse",
                score: 4,
                riskLevel: "high",
                nextQuestionId: "S10-Q04"
            }
        ],

        active: true
    },


    // ==========================================
    // S10-Q04
    // Treatment Adherence
    // ==========================================

    {
        questionId: "S10-Q04",
        sessionNumber: 10,
        order: 3,
        questionSetVersion: 2,

        text: "كيف ترى التزامك بالخطة العلاجية خلال فترة المتابعة؟",

        type: "single",

        category: "treatment_adherence",

        trackKey: "treatment_difficulty",

        answers: [

            {
                id: "A1",
                text: "كنت ملتزمًا بالخطة بشكل جيد جدًا",
                value: "very_good",
                score: 1,
                nextQuestionId: "S10-Q05"
            },

            {
                id: "A2",
                text: "كنت ملتزمًا بها بشكل جيد",
                value: "good",
                score: 2,
                nextQuestionId: "S10-Q05"
            },

            {
                id: "A3",
                text: "واجهت بعض الصعوبة في الالتزام",
                value: "difficulty",
                score: 3,
                riskLevel: "medium",
                nextQuestionId: "S10-Q05"
            },

            {
                id: "A4",
                text: "واجهت صعوبة كبيرة أثرت على التزامي بالخطة",
                value: "major_difficulty",
                score: 4,
                riskLevel: "high",
                nextQuestionId: "S10-Q05"
            }
        ],

        active: true
    },


    // ==========================================
    // S10-Q05
    // Continuation Barrier
    // ==========================================

    {
        questionId: "S10-Q05",
        sessionNumber: 10,
        order: 4,
        questionSetVersion: 2,

        text: "هل يوجد حاليًا أي عائق قد يؤثر على التزامك بالخطة العلاجية؟",

        type: "single",

        category: "risk_detection",

        trackKey: "continuation_barrier",

        answers: [

            {
                id: "A1",
                text: "لا يوجد أي عائق حاليًا",
                value: "none",
                score: 1,
                nextQuestionId: "S10-Q06"
            },

            {
                id: "A2",
                text: "نعم، يوجد عائق بسيط",
                value: "minor",
                score: 2,
                riskLevel: "low",
                opensFollowUp: true,
                nextQuestionId: "S10-Q05-F01"
            },

            {
                id: "A3",
                text: "نعم، يوجد عائق واضح",
                value: "clear",
                score: 3,
                riskLevel: "medium",
                opensFollowUp: true,
                nextQuestionId: "S10-Q05-F01"
            },

            {
                id: "A4",
                text: "نعم، يوجد عائق كبير يجعل الالتزام بالخطة صعبًا جدًا",
                value: "major",
                score: 4,
                riskLevel: "high",
                opensFollowUp: true,
                nextQuestionId: "S10-Q05-F01"
            }
        ],

        active: true
    },


    // ==========================================
    // S10-Q05-F01
    // Continuation Barrier Reason
    // ==========================================

    {
        questionId: "S10-Q05-F01",
        sessionNumber: 10,
        order: 4.1,
        questionSetVersion: 2,

        text: "ما السبب الذي يؤثر على التزامك بالخطة العلاجية؟",

        type: "single",

        category: "risk_detection",

        trackKey: "continuation_barrier_type",

        dependsOn: {
            questionId: "S10-Q05",
            answerValues: [
                "minor",
                "clear",
                "major"
            ]
        },

        answers: [

            {
                id: "A1",
                text: "العمل أو الدراسة أو ضيق الوقت",
                value: "work_study_time",
                nextQuestionId: "S10-Q06"
            },

            {
                id: "A2",
                text: "صعوبة في الوصول إلى العيادة أو المواصلات",
                value: "transportation_access",
                nextQuestionId: "S10-Q06"
            },

            {
                id: "A3",
                text: "صعوبة في الالتزام بالمواعيد",
                value: "appointments",
                nextQuestionId: "S10-Q06"
            },

            {
                id: "A4",
                text: "صعوبة في تنفيذ الخطة العلاجية أو التعليمات",
                value: "treatment_difficulty",
                nextQuestionId: "S10-Q06"
            },

            {
                id: "A5",
                text: "ظروف أو مسؤوليات شخصية أو عائلية",
                value: "personal_family",
                nextQuestionId: "S10-Q06"
            },

            {
                id: "A6",
                text: "سبب آخر",
                value: "other",
                opensFollowUp: true,
                nextQuestionId: "S10-Q05-F02"
            }
        ],

        active: true
    },


    // ==========================================
    // S10-Q05-F02
    // Other Barrier
    // ==========================================

    {
        questionId: "S10-Q05-F02",
        sessionNumber: 10,
        order: 4.2,
        questionSetVersion: 2,

        text: "ما الشيء الآخر الذي يؤثر على التزامك بالخطة؟",

        type: "text",

        category: "risk_detection",

        trackKey: "continuation_barrier_details",

        dependsOn: {
            questionId: "S10-Q05-F01",
            answerValues: [
                "other"
            ]
        },

        required: true,

        active: true,

        nextQuestionId: "S10-Q06"
    },


    // ==========================================
    // S10-Q06
    // New Problem Detection
    // ==========================================

    {
        questionId: "S10-Q06",
        sessionNumber: 10,
        order: 5,
        questionSetVersion: 2,

        text: "هل ظهرت لديك أي مشكلة أو صعوبة جديدة خلال فترة المتابعة؟",

        type: "single",

        category: "patient_state",

        trackKey: "new_problem",

        answers: [

            {
                id: "A1",
                text: "لا، لم تظهر أي مشكلة جديدة",
                value: "none",
                score: 1,
                nextQuestionId: "S10-Q07"
            },

            {
                id: "A2",
                text: "نعم، ظهرت صعوبة بسيطة",
                value: "minor",
                score: 2,
                riskLevel: "low",
                opensFollowUp: true,
                nextQuestionId: "S10-Q06-F01"
            },

            {
                id: "A3",
                text: "نعم، ظهرت صعوبة واضحة",
                value: "clear",
                score: 3,
                riskLevel: "medium",
                opensFollowUp: true,
                nextQuestionId: "S10-Q06-F01"
            },

            {
                id: "A4",
                text: "نعم، ظهرت مشكلة كبيرة",
                value: "major",
                score: 4,
                riskLevel: "high",
                opensFollowUp: true,
                nextQuestionId: "S10-Q06-F01"
            }
        ],

        active: true
    },


    // ==========================================
    // S10-Q06-F01
    // New Problem Details
    // ==========================================

    {
        questionId: "S10-Q06-F01",
        sessionNumber: 10,
        order: 5.1,
        questionSetVersion: 2,

        text: "ما المشكلة أو الصعوبة الجديدة التي ظهرت لديك؟",

        type: "text",

        category: "patient_state",

        trackKey: "new_problem_details",

        dependsOn: {
            questionId: "S10-Q06",
            answerValues: [
                "minor",
                "clear",
                "major"
            ]
        },

        required: true,

        active: true,

        nextQuestionId: "S10-Q07"
    },


    // ==========================================
    // S10-Q07
    // Remaining Concern
    // ==========================================

    {
        questionId: "S10-Q07",
        sessionNumber: 10,
        order: 6,
        questionSetVersion: 2,

        text: "هل هناك جانب من حالتك ما زال يحتاج إلى اهتمام أكبر؟",

        type: "single",

        category: "patient_state",

        trackKey: "remaining_concern",

        answers: [

            {
                id: "A1",
                text: "لا، أشعر أن الأمور تسير بشكل جيد",
                value: "none",
                score: 1,
                nextQuestionId: "S10-Q08"
            },

            {
                id: "A2",
                text: "نعم، هناك جانب بسيط يحتاج إلى تحسين",
                value: "minor",
                score: 2,
                riskLevel: "low",
                nextQuestionId: "S10-Q08"
            },

            {
                id: "A3",
                text: "نعم، هناك جانب واضح ما زال يسبب لي صعوبة",
                value: "clear",
                score: 3,
                riskLevel: "medium",
                nextQuestionId: "S10-Q08"
            },

            {
                id: "A4",
                text: "نعم، هناك جانب كبير ما زال يؤثر على حالتي",
                value: "major",
                score: 4,
                riskLevel: "high",
                nextQuestionId: "S10-Q08"
            }
        ],

        active: true
    },


    // ==========================================
    // S10-Q08
    // Patient Feedback
    // ==========================================

    {
        questionId: "S10-Q08",
        sessionNumber: 10,
        order: 7,
        questionSetVersion: 2,

        text: "هل هناك شيء مهم تريد أن يعرفه الفريق المعالج عن حالتك بعد هذه الفترة من المتابعة؟",

        type: "text",

        category: "patient_feedback",

        trackKey: "patient_feedback",

        active: true,

        nextQuestionId: null
    }

]
 },



child: {
        
// =========================================================
// SESSION 1 — CHILD
// الأسئلة موجهة إلى ولي الأمر
// =========================================================

session1: [

// ==========================================
// S1-Q01
// Version 2 — Child
// ==========================================

{
    questionId: "S1-Q01",
    sessionNumber: 1,
    order: 1,
    questionSetVersion: 2,

    text: "ما أكثر شيء تلاحظ أنه يسبب لطفلك صعوبة حاليًا؟",

    type: "single",
    category: "patient_state",
    trackKey: "main_problem",

    answers: [

        {
            id: "A1",
            text: "الأعراض أو الألم",
            value: "symptoms",
            nextQuestionId: "S1-Q02"
        },

        {
            id: "A2",
            text: "صعوبة في أداء بعض الأنشطة أو الأشياء اليومية",
            value: "difficulty",
            nextQuestionId: "S1-Q02"
        },

        {
            id: "A3",
            text: "شيء متعلق بتنفيذ خطة العلاج",
            value: "treatment_plan",
            opensFollowUp: true,
            nextQuestionId: "treatment_plan_reason"
        },

        {
            id: "A4",
            text: "شيء آخر",
            value: "other",
            opensFollowUp: true,
            nextQuestionId: "main_problem_other"
        }
    ],

    active: true
},


// ==========================================
// Branch: Treatment Plan Reason
// ==========================================

{
    questionId: "treatment_plan_reason",
    sessionNumber: 1,
    questionSetVersion: 2,

    type: "single",
    category: "patient_state",
    trackKey: "treatment_plan_reason",

    text: "ما الشيء المتعلق بخطة العلاج الذي تلاحظ أنه يسبب لطفلك صعوبة؟",

    answers: [

        {
            id: "A1",
            text: "صعوبة في الالتزام بالمواعيد",
            value: "appointments",
            nextQuestionId: "S1-Q02"
        },

        {
            id: "A2",
            text: "صعوبة في تنفيذ التمارين أو التعليمات",
            value: "instructions",
            nextQuestionId: "S1-Q02"
        },

        {
            id: "A3",
            text: "عدم وضوح بعض التعليمات بالنسبة لك كولي أمر",
            value: "unclear_instructions",
            nextQuestionId: "S1-Q02"
        },

        {
            id: "A4",
            text: "شيء آخر",
            value: "other",
            opensFollowUp: true,
            nextQuestionId: "treatment_plan_other"
        }
    ],

    active: true
},


// ==========================================
// Branch: Treatment Plan Other
// ==========================================

{
    questionId: "treatment_plan_other",
    sessionNumber: 1,
    questionSetVersion: 2,

    type: "text",
    category: "patient_state",
    trackKey: "treatment_plan_other",

    text: "ما الشيء الآخر المتعلق بخطة العلاج الذي تريد توضيحه؟",

    nextQuestionId: "S1-Q02",

    active: true
},


// ==========================================
// Branch: Main Problem Other
// ==========================================

{
    questionId: "main_problem_other",
    sessionNumber: 1,
    questionSetVersion: 2,

    type: "text",
    category: "patient_state",
    trackKey: "main_problem_other",

    text: "ما الشيء الآخر الذي تلاحظ أنه يسبب لطفلك صعوبة حاليًا؟",

    nextQuestionId: "S1-Q02",

    active: true
},


// ==========================================
// S1-Q02
// Daily Impact
// ==========================================

{
    questionId: "S1-Q02",
    sessionNumber: 1,
    order: 2,
    questionSetVersion: 2,

    // لا يوجد Risk هنا لأن دي أول جلسة
    // السؤال يقيس تأثير المشكلة على حياة الطفل فقط

    text: "إلى أي درجة تؤثر هذه المشكلة على حياة طفلك اليومية؟",

    type: "single",
    category: "patient_state",
    trackKey: "daily_impact",

    answers: [

        {
            id: "A1",
            text: "تأثير بسيط",
            value: "low",
            score: 1,
            nextQuestionId: "S1-Q03"
        },

        {
            id: "A2",
            text: "تأثير متوسط",
            value: "medium",
            score: 2,
            nextQuestionId: "S1-Q03"
        },

        {
            id: "A3",
            text: "تأثير كبير",
            value: "high",
            score: 3,
            nextQuestionId: "S1-Q03"
        },

        {
            id: "A4",
            text: "تأثير كبير جدًا",
            value: "very_high",
            score: 4,
            nextQuestionId: "S1-Q03"
        }
    ],

    active: true
},


// ==========================================
// S1-Q03
// Treatment Difficulty
// ==========================================

{
    questionId: "S1-Q03",
    sessionNumber: 1,
    order: 3,
    questionSetVersion: 2,

    text: "هل لاحظت أي صعوبة في مساعدة طفلك على تنفيذ ما طُلب منه حتى الآن؟",

    type: "single",
    category: "treatment_adherence",
    trackKey: "treatment_difficulty",

    answers: [

        {
            id: "A1",
            text: "لا، الأمور كانت سهلة بالنسبة لنا",
            value: "none",
            score: 1,
            riskLevel: "none",
            nextQuestionId: "S1-Q04"
        },

        {
            id: "A2",
            text: "نعم، واجهنا صعوبة بسيطة",
            value: "low",
            score: 2,
            riskLevel: "low",
            opensFollowUp: true,
            nextQuestionId: "treatment_difficulty_reason"
        },

        {
            id: "A3",
            text: "نعم، واجهنا صعوبة متوسطة",
            value: "medium",
            score: 3,
            riskLevel: "medium",
            opensFollowUp: true,
            nextQuestionId: "treatment_difficulty_reason"
        },

        {
            id: "A4",
            text: "نعم، واجهنا صعوبة كبيرة",
            value: "high",
            score: 4,
            riskLevel: "high",
            opensFollowUp: true,
            nextQuestionId: "treatment_difficulty_reason"
        }
    ],

    active: true
},


// ==========================================
// Branch: Treatment Difficulty Reason
// ==========================================

{
    questionId: "treatment_difficulty_reason",
    sessionNumber: 1,
    questionSetVersion: 2,

    type: "single",
    category: "treatment_adherence",
    trackKey: "treatment_difficulty_reason",

    text: "ما الصعوبة التي واجهتك في مساعدة طفلك على تنفيذ ما طُلب منه؟",

    answers: [

        {
            id: "A1",
            text: "صعوبة في الالتزام بالمواعيد",
            value: "appointments",
            nextQuestionId: "S1-Q04"
        },

        {
            id: "A2",
            text: "صعوبة في مساعدة الطفل على تنفيذ التمارين أو التعليمات",
            value: "execution",
            nextQuestionId: "S1-Q04"
        },

        {
            id: "A3",
            text: "صعوبة بسبب الوقت أو الظروف اليومية",
            value: "daily_constraints",
            nextQuestionId: "S1-Q04"
        },

        {
            id: "A4",
            text: "شيء آخر",
            value: "other",
            opensFollowUp: true,
            nextQuestionId: "treatment_difficulty_other"
        }
    ],

    active: true
},


// ==========================================
// Branch: Treatment Difficulty Other
// ==========================================

{
    questionId: "treatment_difficulty_other",
    sessionNumber: 1,
    questionSetVersion: 2,

    type: "text",
    category: "treatment_adherence",
    trackKey: "treatment_difficulty_other",

    text: "ما الصعوبة الأخرى التي واجهتك في مساعدة طفلك؟",

    nextQuestionId: "S1-Q04",

    active: true
},


// ==========================================
// S1-Q04
// Clinic Experience
// ==========================================

{
    questionId: "S1-Q04",
    sessionNumber: 1,
    order: 4,
    questionSetVersion: 2,

    text: "كيف تقيّم تجربتك وتجربة طفلك مع العيادة حتى الآن؟",

    type: "single",
    category: "clinic_experience",
    trackKey: "clinic_experience",

    answers: [

        {
            id: "A1",
            text: "التجربة مناسبة جدًا بالنسبة لنا",
            value: "excellent",
            score: 1,
            nextQuestionId: "S1-Q05"
        },

        {
            id: "A2",
            text: "التجربة جيدة ولكن هناك بعض الأمور التي تحتاج إلى تحسين",
            value: "good_with_issues",
            score: 2,
            opensFollowUp: true,
            nextQuestionId: "clinic_experience_issue"
        },

        {
            id: "A3",
            text: "هناك أكثر من شيء يسبب لنا عدم ارتياح",
            value: "multiple_issues",
            score: 3,
            opensFollowUp: true,
            nextQuestionId: "clinic_experience_issue"
        },

        {
            id: "A4",
            text: "التجربة بشكل عام غير مناسبة لنا",
            value: "poor",
            score: 4,
            opensFollowUp: true,
            nextQuestionId: "clinic_experience_issue"
        }
    ],

    active: true
},


// ==========================================
// Branch: Clinic Experience Issue
// ==========================================

{
    questionId: "clinic_experience_issue",
    sessionNumber: 1,
    questionSetVersion: 2,

    type: "single",
    category: "clinic_experience",
    trackKey: "clinic_experience_issue",

    text: "ما الجانب الذي ترى أنه يحتاج إلى تحسين في تجربة طفلك مع العيادة؟",

    answers: [

        {
            id: "A1",
            text: "تكلفة العلاج أو الأسعار",
            value: "pricing",
            nextQuestionId: "S1-Q05"
        },

        {
            id: "A2",
            text: "طريقة التعامل والاهتمام بالطفل",
            value: "staff_treatment",
            nextQuestionId: "S1-Q05"
        },

        {
            id: "A3",
            text: "المواعيد وتنظيم الجلسات",
            value: "appointments",
            nextQuestionId: "S1-Q05"
        },

        {
            id: "A4",
            text: "وضوح شرح الطبيب أو التعليمات لولي الأمر",
            value: "doctor_explanation",
            nextQuestionId: "S1-Q05"
        },

        {
            id: "A5",
            text: "وقت الانتظار",
            value: "waiting_time",
            nextQuestionId: "S1-Q05"
        },

        {
            id: "A6",
            text: "سهولة الوصول إلى العيادة",
            value: "accessibility",
            nextQuestionId: "S1-Q05"
        },

        {
            id: "A7",
            text: "شيء آخر",
            value: "other",
            opensFollowUp: true,
            nextQuestionId: "clinic_experience_other"
        }
    ],

    active: true
},


// ==========================================
// Branch: Clinic Experience Other
// ==========================================

{
    questionId: "clinic_experience_other",
    sessionNumber: 1,
    questionSetVersion: 2,

    type: "text",
    category: "clinic_experience",
    trackKey: "clinic_experience_other",

    text: "ما الشيء الآخر الذي ترى أنه يحتاج إلى تحسين؟",

    nextQuestionId: "S1-Q05",

    active: true
},


// ==========================================
// S1-Q05
// Continuation Barrier
// ==========================================

{
    questionId: "S1-Q05",
    sessionNumber: 1,
    order: 5,
    questionSetVersion: 2,

    text: "هل هناك شيء قد يجعل متابعة طفلك للخطة العلاجية أصعب بالنسبة لك كولي أمر؟",

    type: "single",
    category: "risk_detection",
    trackKey: "continuation_barrier",

    answers: [

        {
            id: "A1",
            text: "لا، لا أتوقع وجود شيء يصعّب عليّ المتابعة",
            value: "none",
            score: 1,
            riskLevel: "none",
            nextQuestionId: null
        },

        {
            id: "A2",
            text: "قد أواجه بعض الصعوبة في الالتزام بالمتابعة",
            value: "possible_barrier",
            score: 2,
            riskLevel: "low",
            opensFollowUp: true,
            nextQuestionId: "continuation_barrier_reason"
        },

        {
            id: "A3",
            text: "هناك شيء قد يجعل متابعة طفلي صعبة بالنسبة لي",
            value: "barrier",
            score: 3,
            riskLevel: "medium",
            opensFollowUp: true,
            nextQuestionId: "continuation_barrier_reason"
        },

        {
            id: "A4",
            text: "أعتقد أن هناك مشكلة قد تمنعني من الاستمرار في المتابعة",
            value: "serious_barrier",
            score: 4,
            riskLevel: "high",
            opensFollowUp: true,
            nextQuestionId: "continuation_barrier_reason"
        }
    ],

    active: true
},


// ==========================================
// Branch: Continuation Barrier Reason
// ==========================================

{
    questionId: "continuation_barrier_reason",
    sessionNumber: 1,
    questionSetVersion: 2,

    type: "single",
    category: "risk_detection",
    trackKey: "continuation_barrier_reason",

    text: "ما السبب الذي قد يجعل متابعة طفلك للخطة العلاجية صعبة بالنسبة لك؟",

    answers: [

        {
            id: "A1",
            text: "صعوبة في الالتزام بالمواعيد",
            value: "appointments",
            nextQuestionId: null
        },

        {
            id: "A2",
            text: "ضيق الوقت أو الانشغال",
            value: "time",
            nextQuestionId: null
        },

        {
            id: "A3",
            text: "صعوبة في مساعدة الطفل على تنفيذ التعليمات أو التمارين",
            value: "execution",
            nextQuestionId: null
        },

        {
            id: "A4",
            text: "صعوبة في الوصول إلى العيادة أو المواصلات",
            value: "transportation_access",
            nextQuestionId: null
        },

        {
            id: "A5",
            text: "شيء آخر",
            value: "other",
            opensFollowUp: true,
            nextQuestionId: "continuation_barrier_other"
        }
    ],

    active: true
},


// ==========================================
// Branch: Continuation Barrier Other
// ==========================================

{
    questionId: "continuation_barrier_other",
    sessionNumber: 1,
    questionSetVersion: 2,

    type: "text",
    category: "risk_detection",
    trackKey: "continuation_barrier_other",

    text: "ما السبب الآخر الذي قد يؤثر على قدرتك على متابعة علاج طفلك؟",

    nextQuestionId: null,

    active: true
}

],



// =========================================================
// SESSION 2 — CHILD
// أول مقارنة فعلية
// الأسئلة موجهة إلى ولي الأمر
// =========================================================

session2: [


// ==========================================
// S2-Q01
// Main Problem
// ==========================================

{
    questionId: "S2-Q01",
    sessionNumber: 2,
    questionSetVersion: 2,
    order: 1,

    text: "مقارنة بما كان عليه حال طفلك في بداية المتابعة، ما التغير الذي تلاحظه الآن؟",

    type: "single",
    category: "patient_state",
    trackKey: "main_problem",

    answers: [

        {
            id: "A1",
            text: "أصبح أفضل بشكل واضح",
            value: "much_better",
            score: 1,
            nextQuestionId: "S2-Q02"
        },

        {
            id: "A2",
            text: "أصبح أفضل قليلًا",
            value: "slightly_better",
            score: 2,
            nextQuestionId: "S2-Q02"
        },

        {
            id: "A3",
            text: "لم ألاحظ تغيرًا واضحًا",
            value: "same",
            score: 3,
            riskLevel: "medium",
            nextQuestionId: "S2-Q02"
        },

        {
            id: "A4",
            text: "أصبح أصعب من قبل",
            value: "worse",
            score: 4,
            riskLevel: "high",
            nextQuestionId: "S2-Q02"
        }
    ],

    active: true
},


// ==========================================
// S2-Q02
// Daily Impact
// ==========================================

{
    questionId: "S2-Q02",
    sessionNumber: 2,
    questionSetVersion: 2,
    order: 2,

    text: "كيف أصبح تأثير المشكلة على أنشطة طفلك وحياته اليومية مقارنة ببداية المتابعة؟",

    type: "single",
    category: "patient_state",
    trackKey: "daily_impact",

    answers: [

        {
            id: "A1",
            text: "أصبح تأثيرها أقل بشكل واضح",
            value: "much_less",
            score: 1,
            nextQuestionId: "S2-Q03"
        },

        {
            id: "A2",
            text: "أصبح تأثيرها أقل قليلًا",
            value: "less",
            score: 2,
            nextQuestionId: "S2-Q03"
        },

        {
            id: "A3",
            text: "ما زال تأثيرها تقريبًا بنفس الدرجة",
            value: "same",
            score: 3,
            riskLevel: "medium",
            nextQuestionId: "S2-Q03"
        },

        {
            id: "A4",
            text: "أصبح تأثيرها أكبر من قبل",
            value: "worse",
            score: 4,
            riskLevel: "high",
            nextQuestionId: "S2-Q03"
        }
    ],

    active: true
},


// ==========================================
// S2-Q03
// Treatment Difficulty
// ==========================================

{
    questionId: "S2-Q03",
    sessionNumber: 2,
    questionSetVersion: 2,
    order: 3,

    text: "كيف أصبحت قدرتك على مساعدة طفلك في تنفيذ الخطة العلاجية مقارنة بما كانت عليه في البداية؟",

    type: "single",
    category: "treatment_adherence",
    trackKey: "treatment_difficulty",

    answers: [

        {
            id: "A1",
            text: "أصبحت أسهل بكثير",
            value: "much_easier",
            score: 1,
            nextQuestionId: "S2-Q05"
        },

        {
            id: "A2",
            text: "أصبحت أسهل قليلًا",
            value: "easier",
            score: 2,
            nextQuestionId: "S2-Q05"
        },

        {
            id: "A3",
            text: "ما زالت بنفس الصعوبة تقريبًا",
            value: "same",
            score: 3,
            riskLevel: "medium",
            nextQuestionId: "S2-Q05"
        },

        {
            id: "A4",
            text: "أصبحت أصعب من قبل",
            value: "worse",
            score: 4,
            riskLevel: "high",
            nextQuestionId: "S2-Q05"
        }
    ],

    active: true
},


// ==========================================
// S2-Q05
// Clinic Experience
// ==========================================

{
    questionId: "S2-Q05",
    sessionNumber: 2,
    questionSetVersion: 2,
    order: 4,

    text: "هل ما زال هناك جانب من تجربة طفلك مع العلاج أو العيادة يحتاج إلى تحسين؟",

    type: "single",
    category: "clinic_experience",
    trackKey: "clinic_experience",

    answers: [

        {
            id: "A1",
            text: "لا، الأمور أصبحت مناسبة بالنسبة لنا",
            value: "resolved",
            score: 1,
            nextQuestionId: "S2-Q06"
        },

        {
            id: "A2",
            text: "نعم، هناك جانب بسيط يحتاج إلى تحسين",
            value: "minor_issue",
            score: 2,
            opensFollowUp: true,
            nextQuestionId: "clinic_experience_issue"
        },

        {
            id: "A3",
            text: "نعم، هناك جانب ما زال يسبب لنا إزعاجًا",
            value: "ongoing_issue",
            score: 3,
            opensFollowUp: true,
            nextQuestionId: "clinic_experience_issue"
        },

        {
            id: "A4",
            text: "نعم، هناك مشكلة كبيرة تؤثر على تجربتنا",
            value: "major_issue",
            score: 4,
            opensFollowUp: true,
            nextQuestionId: "clinic_experience_issue"
        }
    ],

    active: true
},


// ==========================================
// Branch: Clinic Experience Issue
// ==========================================

{
    questionId: "clinic_experience_issue",
    sessionNumber: 2,
    questionSetVersion: 2,

    type: "single",
    category: "clinic_experience",
    trackKey: "clinic_experience_issue",

    text: "ما الجانب الذي ما زلت ترى أنه يحتاج إلى تحسين في تجربة طفلك؟",

    answers: [

        // -------- Clinic --------

        {
            id: "A1",
            text: "صعوبة فهم شرح الطبيب أو المشورة أو التعليمات",
            value: "doctor_explanation",
            nextQuestionId: "S2-Q06"
        },

        {
            id: "A2",
            text: "طريقة التعامل والاهتمام بالطفل",
            value: "staff_treatment",
            nextQuestionId: "S2-Q06"
        },

        {
            id: "A3",
            text: "السعر أو تكلفة العلاج",
            value: "pricing",
            nextQuestionId: "S2-Q06"
        },

        {
            id: "A4",
            text: "المواعيد أو تنظيم الجلسات",
            value: "appointments",
            nextQuestionId: "S2-Q06"
        },

        {
            id: "A5",
            text: "وقت الانتظار أو تنظيم الدخول والخروج",
            value: "waiting_time",
            nextQuestionId: "S2-Q06"
        },

        // -------- Patient / Guardian --------

        {
            id: "A6",
            text: "صعوبة الوصول إلى العيادة أو المواصلات",
            value: "transportation_access",
            nextQuestionId: "S2-Q06"
        },

        {
            id: "A7",
            text: "الانشغال أو ضيق الوقت لديّ",
            value: "time_constraints",
            nextQuestionId: "S2-Q06"
        },

        {
            id: "A8",
            text: "ظروف أو مسؤوليات يومية تجعل متابعة طفلي صعبة",
            value: "daily_life_constraints",
            nextQuestionId: "S2-Q06"
        },

        {
            id: "A9",
            text: "صعوبة في المتابعة بسبب ظروفي الشخصية أو الأسرية",
            value: "personal_constraints",
            nextQuestionId: "S2-Q06"
        },

        {
            id: "A10",
            text: "سبب آخر متعلق بظروفي",
            value: "patient_other",
            opensFollowUp: true,
            nextQuestionId: "clinic_experience_patient_other"
        }
    ],

    active: true
},


// ==========================================
// Branch: Patient Other Experience
// ==========================================

{
    questionId: "clinic_experience_patient_other",
    sessionNumber: 2,
    questionSetVersion: 2,

    type: "text",
    category: "clinic_experience",
    trackKey: "clinic_experience_patient_other",

    text: "ما الظرف الآخر الذي يؤثر على قدرتك على متابعة علاج طفلك؟",

    nextQuestionId: "S2-Q06",

    active: true
},


// ==========================================
// S2-Q06
// Continuation Barrier
// ==========================================

{
    questionId: "S2-Q06",
    sessionNumber: 2,
    questionSetVersion: 2,
    order: 5,

    text: "هل يوجد حاليًا شيء قد يجعل استمرار طفلك في الخطة العلاجية أصعب من السابق؟",

    type: "single",
    category: "risk_detection",
    trackKey: "continuation_barrier",

    answers: [

        {
            id: "A1",
            text: "لا، لا يوجد شيء قد يصعّب عليّ الاستمرار",
            value: "none",
            score: 1,
            nextQuestionId: null
        },

        {
            id: "A2",
            text: "لا، بل أصبحت المتابعة أسهل بالنسبة لي",
            value: "improved",
            score: 2,
            nextQuestionId: null
        },

        {
            id: "A3",
            text: "ما زالت هناك نفس الصعوبة تقريبًا",
            value: "same",
            score: 3,
            riskLevel: "medium",
            opensFollowUp: true,
            nextQuestionId: "continuation_barrier_reason"
        },

        {
            id: "A4",
            text: "أصبحت هناك صعوبة أكبر قد تؤثر على استمراري في متابعة طفلي",
            value: "worse",
            score: 4,
            riskLevel: "high",
            opensFollowUp: true,
            nextQuestionId: "continuation_barrier_reason"
        }
    ],

    active: true
},


// ==========================================
// Branch: Continuation Barrier Reason
// ==========================================

{
    questionId: "continuation_barrier_reason",
    sessionNumber: 2,
    questionSetVersion: 2,

    type: "single",
    category: "risk_detection",
    trackKey: "continuation_barrier_reason",

    text: "ما السبب الذي يجعل استمرار طفلك في الخطة العلاجية صعبًا بالنسبة لك؟",

    answers: [

        {
            id: "A1",
            text: "صعوبة في الالتزام بالمواعيد",
            value: "appointments",
            nextQuestionId: null
        },

        {
            id: "A2",
            text: "ضيق الوقت أو الانشغال",
            value: "time",
            nextQuestionId: null
        },

        {
            id: "A3",
            text: "صعوبة في مساعدة الطفل على تنفيذ التعليمات أو التمارين",
            value: "execution",
            nextQuestionId: null
        },

        {
            id: "A4",
            text: "صعوبة في الوصول إلى العيادة أو المواصلات",
            value: "transportation_access",
            nextQuestionId: null
        },

        {
            id: "A5",
            text: "ظروف أو مسؤوليات يومية تعيق المتابعة",
            value: "daily_life",
            nextQuestionId: null
        },

        {
            id: "A6",
            text: "سبب آخر",
            value: "other",
            opensFollowUp: true,
            nextQuestionId: "continuation_barrier_other"
        }
    ],

    active: true
},


// ==========================================
// Branch: Continuation Barrier Other
// ==========================================

{
    questionId: "continuation_barrier_other",
    sessionNumber: 2,
    questionSetVersion: 2,

    type: "text",
    category: "risk_detection",
    trackKey: "continuation_barrier_other",

    text: "ما السبب الآخر الذي قد يؤثر على قدرتك على متابعة علاج طفلك؟",

    nextQuestionId: null,

    active: true
}

],
// =========================================================
// SESSION 3 — CHILD
// الأسئلة موجهة إلى ولي الأمر
// =========================================================

session3: [

    // ==========================================
    // S3-Q01
    // Main Problem
    // ==========================================

    {
        questionId: "S3-Q01",
        sessionNumber: 3,
        questionSetVersion: 2,
        order: 1,

        text: "مقارنة ببداية المتابعة، كيف ترى المشكلة الأساسية لدى طفلك الآن؟",

        type: "single",
        category: "patient_state",
        trackKey: "main_problem",

        answers: [

            {
                id: "A1",
                text: "تحسنت بشكل واضح",
                value: "much_better",
                score: 1,
                nextQuestionId: "S3-Q02"
            },

            {
                id: "A2",
                text: "تحسنت قليلًا",
                value: "better",
                score: 2,
                nextQuestionId: "S3-Q02"
            },

            {
                id: "A3",
                text: "لم تتغير بشكل واضح",
                value: "same",
                score: 3,
                riskLevel: "medium",
                nextQuestionId: "S3-Q02"
            },

            {
                id: "A4",
                text: "أصبحت أسوأ",
                value: "worse",
                score: 4,
                riskLevel: "high",
                nextQuestionId: "S3-Q02"
            }
        ],

        active: true
    },


    // ==========================================
    // S3-Q02
    // Daily Impact
    // ==========================================

    {
        questionId: "S3-Q02",
        sessionNumber: 3,
        questionSetVersion: 2,
        order: 2,

        text: "مقارنة بالجلسة السابقة، كيف أصبح تأثير المشكلة على حياة طفلك وأنشطته اليومية؟",

        type: "single",
        category: "patient_state",
        trackKey: "daily_impact",

        answers: [

            {
                id: "A1",
                text: "أصبح تأثيرها أقل بكثير",
                value: "much_less",
                score: 1,
                nextQuestionId: "S3-Q03"
            },

            {
                id: "A2",
                text: "أصبح تأثيرها أقل",
                value: "less",
                score: 2,
                nextQuestionId: "S3-Q03"
            },

            {
                id: "A3",
                text: "ما زال تأثيرها كما هو تقريبًا",
                value: "same",
                score: 3,
                riskLevel: "medium",
                nextQuestionId: "S3-Q03"
            },

            {
                id: "A4",
                text: "أصبح تأثيرها أكبر من قبل",
                value: "worse",
                score: 4,
                riskLevel: "high",
                nextQuestionId: "S3-Q03"
            }
        ],

        active: true
    },


    // ==========================================
    // S3-Q03
    // Treatment Difficulty
    // ==========================================

    {
        questionId: "S3-Q03",
        sessionNumber: 3,
        questionSetVersion: 2,
        order: 3,

        text: "مقارنة بالجلسة السابقة، كيف أصبحت قدرتك على مساعدة طفلك في تنفيذ الخطة العلاجية؟",

        type: "single",
        category: "treatment_adherence",
        trackKey: "treatment_difficulty",

        answers: [

            {
                id: "A1",
                text: "أصبحت أسهل بكثير",
                value: "much_easier",
                score: 1,
                nextQuestionId: "S3-Q06"
            },

            {
                id: "A2",
                text: "أصبحت أسهل",
                value: "easier",
                score: 2,
                nextQuestionId: "S3-Q06"
            },

            {
                id: "A3",
                text: "لم تتغير وما زالت بنفس الصعوبة تقريبًا",
                value: "same",
                score: 3,
                riskLevel: "medium",
                nextQuestionId: "S3-Q06"
            },

            {
                id: "A4",
                text: "أصبحت أصعب",
                value: "worse",
                score: 4,
                riskLevel: "high",
                nextQuestionId: "S3-Q06"
            }
        ],

        active: true
    },


    // ==========================================
    // S3-Q06
    // Continuation Barrier
    // ==========================================

    {
        questionId: "S3-Q06",
        sessionNumber: 3,
        questionSetVersion: 2,
        order: 4,

        text: "هل ما زال هناك شيء قد يؤثر على استمرارك في متابعة علاج طفلك؟",

        type: "single",
        category: "risk_detection",
        trackKey: "continuation_barrier",

        answers: [

            {
                id: "A1",
                text: "لا، لا يوجد شيء حاليًا",
                value: "none",
                score: 1,
                nextQuestionId: "S3-Q07"
            },

            {
                id: "A2",
                text: "لا، بل أصبحت المتابعة أسهل بالنسبة لي",
                value: "improved",
                score: 2,
                nextQuestionId: "S3-Q07"
            },

            {
                id: "A3",
                text: "ما زالت هناك نفس الصعوبة تقريبًا",
                value: "same",
                score: 3,
                riskLevel: "medium",
                opensFollowUp: true,
                nextQuestionId: "continuation_barrier_reason_s3"
            },

            {
                id: "A4",
                text: "أصبحت هناك مشكلة أكبر قد تؤثر على استمراري في متابعة طفلي",
                value: "worse",
                score: 4,
                riskLevel: "high",
                opensFollowUp: true,
                nextQuestionId: "continuation_barrier_reason_s3"
            }
        ],

        active: true
    },


    // ==========================================
    // Branch: Continuation Barrier Reason S3
    // ==========================================

    {
        questionId: "continuation_barrier_reason_s3",
        sessionNumber: 3,
        questionSetVersion: 2,

        type: "single",
        category: "risk_detection",
        trackKey: "continuation_barrier_reason",

        text: "ما السبب الذي يجعل متابعة علاج طفلك صعبة بالنسبة لك؟",

        answers: [

            {
                id: "A1",
                text: "صعوبة في الالتزام بالمواعيد",
                value: "appointments",
                nextQuestionId: "S3-Q07"
            },

            {
                id: "A2",
                text: "ضيق الوقت أو الانشغال",
                value: "time",
                nextQuestionId: "S3-Q07"
            },

            {
                id: "A3",
                text: "صعوبة في مساعدة الطفل على تنفيذ التعليمات أو التمارين",
                value: "execution",
                nextQuestionId: "S3-Q07"
            },

            {
                id: "A4",
                text: "صعوبة في الوصول إلى العيادة أو المواصلات",
                value: "transportation_access",
                nextQuestionId: "S3-Q07"
            },

            {
                id: "A5",
                text: "ظروف أو مسؤوليات يومية تعيق المتابعة",
                value: "daily_life",
                nextQuestionId: "S3-Q07"
            },

            {
                id: "A6",
                text: "سبب آخر",
                value: "other",
                opensFollowUp: true,
                nextQuestionId: "continuation_barrier_other_s3"
            }
        ],

        active: true
    },


    // ==========================================
    // Branch: Continuation Barrier Other S3
    // ==========================================

    {
        questionId: "continuation_barrier_other_s3",
        sessionNumber: 3,
        questionSetVersion: 2,

        type: "text",
        category: "risk_detection",
        trackKey: "continuation_barrier_other",

        text: "ما السبب الآخر الذي قد يؤثر على قدرتك على متابعة علاج طفلك؟",

        nextQuestionId: "S3-Q07",

        active: true
    },


    // ==========================================
    // S3-Q07
    // New Problem Detection
    // ==========================================

    {
        questionId: "S3-Q07",
        sessionNumber: 3,
        questionSetVersion: 2,
        order: 5,

        text: "هل ظهرت لدى طفلك مشكلة أو صعوبة جديدة مختلفة عن المشكلة التي كنا نتابعها؟",

        type: "single",
        category: "patient_state",
        trackKey: "new_problem",

        answers: [

            {
                id: "A1",
                text: "لا",
                value: "none",
                score: 1,
                nextQuestionId: "S3-Q08"
            },

            {
                id: "A2",
                text: "نعم، ظهرت صعوبة بسيطة",
                value: "minor",
                score: 2,
                riskLevel: "low",
                opensFollowUp: true,
                nextQuestionId: "S3-Q07-F01"
            },

            {
                id: "A3",
                text: "نعم، ظهرت صعوبة واضحة",
                value: "clear",
                score: 3,
                riskLevel: "medium",
                opensFollowUp: true,
                nextQuestionId: "S3-Q07-F01"
            },

            {
                id: "A4",
                text: "نعم، ظهرت صعوبة كبيرة",
                value: "major",
                score: 4,
                riskLevel: "high",
                opensFollowUp: true,
                nextQuestionId: "S3-Q07-F01"
            }
        ],

        active: true
    },


    // ==========================================
    // S3-Q07-F01
    // New Problem Details
    // ==========================================

    {
        questionId: "S3-Q07-F01",
        sessionNumber: 3,
        questionSetVersion: 2,
        order: 5.1,

        text: "ما المشكلة أو الصعوبة الجديدة التي لاحظتها لدى طفلك؟",

        type: "text",
        category: "patient_state",
        trackKey: "new_problem_details",

        dependsOn: {
            questionId: "S3-Q07",
            answerValues: [
                "minor",
                "clear",
                "major"
            ]
        },

        required: true,
        active: true,
        nextQuestionId: "S3-Q08"
    },


    // ==========================================
    // S3-Q08
    // Patient / Guardian Feedback
    // ==========================================

    {
        questionId: "S3-Q08",
        sessionNumber: 3,
        questionSetVersion: 2,
        order: 6,

        text: "هل هناك شيء آخر مهم تريد أن يعرفه الفريق المعالج عن حالة طفلك الآن؟",

        type: "text",
        category: "patient_feedback",
        trackKey: "patient_feedback",

        active: true,

        nextQuestionId: null
    }

],


// =========================================================
// SESSION 4 — CHILD
// =========================================================

session4: [

    // ==========================================
    // S4-Q01
    // Main Problem
    // ==========================================

    {
        questionId: "S4-Q01",
        sessionNumber: 4,
        questionSetVersion: 2,
        order: 1,

        text: "مقارنة بالجلسة السابقة، كيف ترى حال طفلك الآن؟",

        type: "single",
        category: "patient_state",
        trackKey: "main_problem",

        answers: [

            {
                id: "A1",
                text: "ألاحظ تحسنًا واضحًا",
                value: "much_better",
                score: 1,
                nextQuestionId: "S4-Q02"
            },

            {
                id: "A2",
                text: "ألاحظ تحسنًا بسيطًا",
                value: "better",
                score: 2,
                nextQuestionId: "S4-Q02"
            },

            {
                id: "A3",
                text: "لم ألاحظ تغيرًا واضحًا",
                value: "same",
                score: 3,
                riskLevel: "medium",
                nextQuestionId: "S4-Q02"
            },

            {
                id: "A4",
                text: "ألاحظ أن حالة طفلي أصبحت أسوأ",
                value: "worse",
                score: 4,
                riskLevel: "high",
                nextQuestionId: "S4-Q02"
            }
        ],

        active: true
    },


    // ==========================================
    // S4-Q02
    // Daily Impact
    // ==========================================

    {
        questionId: "S4-Q02",
        sessionNumber: 4,
        questionSetVersion: 2,
        order: 2,

        text: "مقارنة بالجلسة السابقة، كيف أصبح تأثير حالة طفلك على حياته وأنشطته اليومية؟",

        type: "single",
        category: "patient_state",
        trackKey: "daily_impact",

        answers: [

            {
                id: "A1",
                text: "أصبح التأثير أقل بكثير",
                value: "much_less",
                score: 1,
                nextQuestionId: "S4-Q03"
            },

            {
                id: "A2",
                text: "أصبح التأثير أقل",
                value: "less",
                score: 2,
                nextQuestionId: "S4-Q03"
            },

            {
                id: "A3",
                text: "ما زال التأثير كما هو تقريبًا",
                value: "same",
                score: 3,
                riskLevel: "medium",
                nextQuestionId: "S4-Q03"
            },

            {
                id: "A4",
                text: "أصبح التأثير أكبر من قبل",
                value: "worse",
                score: 4,
                riskLevel: "high",
                nextQuestionId: "S4-Q03"
            }
        ],

        active: true
    },


    // ==========================================
    // S4-Q03
    // Treatment Difficulty
    // ==========================================

    {
        questionId: "S4-Q03",
        sessionNumber: 4,
        questionSetVersion: 2,
        order: 3,

        text: "مقارنة بالجلسة السابقة، كيف أصبحت قدرتك على مساعدة طفلك في تنفيذ الخطة العلاجية؟",

        type: "single",
        category: "treatment_adherence",
        trackKey: "treatment_difficulty",

        answers: [

            {
                id: "A1",
                text: "أصبحت أسهل بكثير",
                value: "much_easier",
                score: 1,
                nextQuestionId: "S4-Q05"
            },

            {
                id: "A2",
                text: "أصبحت أسهل",
                value: "easier",
                score: 2,
                nextQuestionId: "S4-Q05"
            },

            {
                id: "A3",
                text: "لم تتغير وما زالت بنفس الصعوبة تقريبًا",
                value: "same",
                score: 3,
                riskLevel: "medium",
                nextQuestionId: "S4-Q05"
            },

            {
                id: "A4",
                text: "أصبحت أصعب",
                value: "worse",
                score: 4,
                riskLevel: "high",
                nextQuestionId: "S4-Q05"
            }
        ],

        active: true
    },


    // ==========================================
    // S4-Q05
    // Continuation Barrier
    // ==========================================

    {
        questionId: "S4-Q05",
        sessionNumber: 4,
        questionSetVersion: 2,
        order: 4,

        text: "هل واجهت أي شيء جديد جعل متابعة علاج طفلك أو تنفيذ الخطة العلاجية أصعب عليك؟",

        type: "single",
        category: "risk_detection",
        trackKey: "continuation_barrier",

        answers: [

            {
                id: "A1",
                text: "لا، لم أواجه أي عائق جديد",
                value: "none",
                score: 1,
                nextQuestionId: "S4-Q06"
            },

            {
                id: "A2",
                text: "نعم، واجهت صعوبة بسيطة",
                value: "minor",
                score: 2,
                riskLevel: "low",
                opensFollowUp: true,
                nextQuestionId: "S4-Q05-F01"
            },

            {
                id: "A3",
                text: "نعم، واجهت صعوبة واضحة",
                value: "clear",
                score: 3,
                riskLevel: "medium",
                opensFollowUp: true,
                nextQuestionId: "S4-Q05-F01"
            },

            {
                id: "A4",
                text: "نعم، أصبحت المتابعة صعبة جدًا بالنسبة لي وقد تؤثر على استمراري في علاج طفلي",
                value: "major",
                score: 4,
                riskLevel: "high",
                opensFollowUp: true,
                nextQuestionId: "S4-Q05-F01"
            }
        ],

        active: true
    },


    // ==========================================
    // S4-Q05-F01
    // Continuation Barrier Reason
    // ==========================================

    {
        questionId: "S4-Q05-F01",
        sessionNumber: 4,
        questionSetVersion: 2,
        order: 4.1,

        text: "ما السبب الذي جعل متابعة علاج طفلك أو تنفيذ الخطة العلاجية أصعب عليك؟",

        type: "single",
        category: "risk_detection",
        trackKey: "continuation_barrier_type",

        dependsOn: {
            questionId: "S4-Q05",
            answerValues: [
                "minor",
                "clear",
                "major"
            ]
        },

        answers: [

            {
                id: "A1",
                text: "صعوبة في الوصول إلى العيادة أو المواصلات",
                value: "transportation_access",
                nextQuestionId: "S4-Q06"
            },

            {
                id: "A2",
                text: "العمل أو الدراسة أو ضيق الوقت",
                value: "work_study_time",
                nextQuestionId: "S4-Q06"
            },

            {
                id: "A3",
                text: "صعوبة في الالتزام بالمواعيد",
                value: "appointments",
                nextQuestionId: "S4-Q06"
            },

            {
                id: "A4",
                text: "صعوبة في مساعدة الطفل على تنفيذ التعليمات أو التمارين",
                value: "execution",
                nextQuestionId: "S4-Q06"
            },

            {
                id: "A5",
                text: "ظروف شخصية أو عائلية",
                value: "personal_family",
                nextQuestionId: "S4-Q06"
            },

            {
                id: "A6",
                text: "سبب آخر",
                value: "other",
                opensFollowUp: true,
                nextQuestionId: "S4-Q05-F02"
            }
        ],

        active: true
    },


    // ==========================================
    // S4-Q05-F02
    // Other Barrier
    // ==========================================

    {
        questionId: "S4-Q05-F02",
        sessionNumber: 4,
        questionSetVersion: 2,
        order: 4.2,

        text: "ما السبب الآخر الذي يؤثر على قدرتك على الاستمرار في متابعة علاج طفلك؟",

        type: "text",
        category: "risk_detection",
        trackKey: "continuation_barrier_details",

        dependsOn: {
            questionId: "S4-Q05-F01",
            answerValues: [
                "other"
            ]
        },

        required: true,
        active: true,

        nextQuestionId: "S4-Q06"
    },


    // ==========================================
    // S4-Q06
    // New Problem Detection
    // ==========================================

    {
        questionId: "S4-Q06",
        sessionNumber: 4,
        questionSetVersion: 2,
        order: 5,

        text: "هل ظهرت لدى طفلك مشكلة أو صعوبة أخرى تحتاج إلى متابعة؟",

        type: "single",
        category: "patient_state",
        trackKey: "new_problem",

        answers: [

            {
                id: "A1",
                text: "لا، لا توجد مشكلة أخرى حاليًا",
                value: "none",
                score: 1,
                nextQuestionId: "S4-Q07"
            },

            {
                id: "A2",
                text: "نعم، توجد صعوبة بسيطة",
                value: "minor",
                score: 2,
                riskLevel: "low",
                opensFollowUp: true,
                nextQuestionId: "S4-Q06-F01"
            },

            {
                id: "A3",
                text: "نعم، توجد صعوبة واضحة",
                value: "clear",
                score: 3,
                riskLevel: "medium",
                opensFollowUp: true,
                nextQuestionId: "S4-Q06-F01"
            },

            {
                id: "A4",
                text: "نعم، توجد مشكلة كبيرة تؤثر على طفلي",
                value: "major",
                score: 4,
                riskLevel: "high",
                opensFollowUp: true,
                nextQuestionId: "S4-Q06-F01"
            }
        ],

        active: true
    },


    // ==========================================
    // S4-Q06-F01
    // New Problem Details
    // ==========================================

    {
        questionId: "S4-Q06-F01",
        sessionNumber: 4,
        questionSetVersion: 2,
        order: 5.1,

        text: "ما المشكلة أو الصعوبة الجديدة التي لاحظتها لدى طفلك؟",

        type: "text",
        category: "patient_state",
        trackKey: "new_problem_details",

        dependsOn: {
            questionId: "S4-Q06",
            answerValues: [
                "minor",
                "clear",
                "major"
            ]
        },

        required: true,
        active: true,

        nextQuestionId: "S4-Q07"
    },


    // ==========================================
    // S4-Q07
    // Patient / Guardian Feedback
    // ==========================================

    {
        questionId: "S4-Q07",
        sessionNumber: 4,
        questionSetVersion: 2,
        order: 6,

        text: "هل هناك شيء آخر مهم تريد أن يعرفه الفريق المعالج عن حالة طفلك الآن؟",

        type: "text",
        category: "patient_feedback",
        trackKey: "patient_feedback",

        active: true,

        nextQuestionId: null
    }

],

// =========================================================
// SESSION 5 — CHILD
// =========================================================

session5: [

    // ==========================================
    // S5-Q01
    // Main Problem
    // ==========================================

    {
        questionId: "S5-Q01",
        sessionNumber: 5,
        questionSetVersion: 2,
        order: 1,

        text: "منذ بداية المتابعة وحتى الآن، كيف ترى حالة طفلك بشكل عام؟",

        type: "single",
        category: "patient_state",
        trackKey: "main_problem",

        answers: [

            {
                id: "A1",
                text: "ألاحظ تحسنًا واضحًا",
                value: "much_better",
                score: 1,
                nextQuestionId: "S5-Q02"
            },

            {
                id: "A2",
                text: "ألاحظ تحسنًا جزئيًا",
                value: "better",
                score: 2,
                nextQuestionId: "S5-Q02"
            },

            {
                id: "A3",
                text: "لم ألاحظ تغيرًا واضحًا حتى الآن",
                value: "same",
                score: 3,
                riskLevel: "medium",
                nextQuestionId: "S5-Q02"
            },

            {
                id: "A4",
                text: "ألاحظ أن حالة طفلي أصبحت أسوأ",
                value: "worse",
                score: 4,
                riskLevel: "high",
                nextQuestionId: "S5-Q02"
            }
        ],

        active: true
    },


    // ==========================================
    // S5-Q02
    // Daily Impact
    // ==========================================

    {
        questionId: "S5-Q02",
        sessionNumber: 5,
        questionSetVersion: 2,
        order: 2,

        text: "منذ بداية المتابعة وحتى الآن، كيف أصبح تأثير المشكلة على حياة طفلك اليومية؟",

        type: "single",
        category: "patient_state",
        trackKey: "daily_impact",

        answers: [

            {
                id: "A1",
                text: "أصبح تأثيرها أقل بكثير",
                value: "much_less",
                score: 1,
                nextQuestionId: "S5-Q03"
            },

            {
                id: "A2",
                text: "أصبح تأثيرها أقل بشكل واضح",
                value: "less",
                score: 2,
                nextQuestionId: "S5-Q03"
            },

            {
                id: "A3",
                text: "ما زال تأثيرها كما هو تقريبًا",
                value: "same",
                score: 3,
                riskLevel: "medium",
                nextQuestionId: "S5-Q03"
            },

            {
                id: "A4",
                text: "أصبح تأثيرها أكبر من قبل",
                value: "worse",
                score: 4,
                riskLevel: "high",
                nextQuestionId: "S5-Q03"
            }
        ],

        active: true
    },


    // ==========================================
    // S5-Q03
    // Activity Change
    // ==========================================

    {
        questionId: "S5-Q03",
        sessionNumber: 5,
        questionSetVersion: 2,
        order: 3,

        text: "منذ بداية المتابعة، كيف أصبحت قدرة طفلك على القيام بالأنشطة التي كانت صعبة عليه؟",

        type: "single",
        category: "patient_state",
        trackKey: "activity_change",

        answers: [

            {
                id: "A1",
                text: "أصبحت أسهل بشكل واضح",
                value: "much_easier",
                score: 1,
                nextQuestionId: "S5-Q04"
            },

            {
                id: "A2",
                text: "أصبحت أسهل قليلًا",
                value: "easier",
                score: 2,
                nextQuestionId: "S5-Q04"
            },

            {
                id: "A3",
                text: "ما زالت بنفس الصعوبة تقريبًا",
                value: "same",
                score: 3,
                riskLevel: "medium",
                nextQuestionId: "S5-Q04"
            },

            {
                id: "A4",
                text: "أصبحت أصعب من البداية",
                value: "worse",
                score: 4,
                riskLevel: "high",
                nextQuestionId: "S5-Q04"
            }
        ],

        active: true
    },


    // ==========================================
    // S5-Q04
    // Treatment Difficulty
    // ==========================================

    {
        questionId: "S5-Q04",
        sessionNumber: 5,
        questionSetVersion: 2,
        order: 4,

        text: "منذ بداية المتابعة، كيف أصبحت قدرتك على مساعدة طفلك في الالتزام بالخطة العلاجية؟",

        type: "single",
        category: "treatment_adherence",
        trackKey: "treatment_difficulty",

        answers: [

            {
                id: "A1",
                text: "أصبحت أسهل بكثير",
                value: "much_easier",
                score: 1,
                nextQuestionId: "S5-Q05"
            },

            {
                id: "A2",
                text: "أصبحت أسهل",
                value: "easier",
                score: 2,
                nextQuestionId: "S5-Q05"
            },

            {
                id: "A3",
                text: "لم تتغير وما زالت بنفس الصعوبة تقريبًا",
                value: "same",
                score: 3,
                riskLevel: "medium",
                nextQuestionId: "S5-Q05"
            },

            {
                id: "A4",
                text: "أصبحت أصعب",
                value: "worse",
                score: 4,
                riskLevel: "high",
                nextQuestionId: "S5-Q05"
            }
        ],

        active: true
    },


    // ==========================================
    // S5-Q05
    // New Problem Detection
    // ==========================================

    {
        questionId: "S5-Q05",
        sessionNumber: 5,
        questionSetVersion: 2,
        order: 5,

        text: "خلال الفترة الأخيرة، هل ظهرت لدى طفلك مشكلة أو صعوبة جديدة غير المشكلة التي كنا نتابعها؟",

        type: "single",
        category: "patient_state",
        trackKey: "new_problem",

        answers: [

            {
                id: "A1",
                text: "لا، لم تظهر مشكلة جديدة",
                value: "none",
                score: 1,
                nextQuestionId: "S5-Q06"
            },

            {
                id: "A2",
                text: "نعم، ظهرت صعوبة بسيطة",
                value: "minor",
                score: 2,
                riskLevel: "low",
                opensFollowUp: true,
                nextQuestionId: "S5-Q05-F01"
            },

            {
                id: "A3",
                text: "نعم، ظهرت صعوبة واضحة",
                value: "clear",
                score: 3,
                riskLevel: "medium",
                opensFollowUp: true,
                nextQuestionId: "S5-Q05-F01"
            },

            {
                id: "A4",
                text: "نعم، ظهرت مشكلة كبيرة تؤثر على طفلي",
                value: "major",
                score: 4,
                riskLevel: "high",
                opensFollowUp: true,
                nextQuestionId: "S5-Q05-F01"
            }
        ],

        active: true
    },


    // ==========================================
    // S5-Q05-F01
    // New Problem Details
    // ==========================================

    {
        questionId: "S5-Q05-F01",
        sessionNumber: 5,
        questionSetVersion: 2,
        order: 5.1,

        text: "ما المشكلة أو الصعوبة الجديدة التي لاحظتها لدى طفلك؟",

        type: "text",
        category: "patient_state",
        trackKey: "new_problem_details",

        dependsOn: {
            questionId: "S5-Q05",
            answerValues: [
                "minor",
                "clear",
                "major"
            ]
        },

        required: true,
        active: true,

        nextQuestionId: "S5-Q06"
    },


    // ==========================================
    // S5-Q06
    // Continuation Barrier
    // ==========================================

    {
        questionId: "S5-Q06",
        sessionNumber: 5,
        questionSetVersion: 2,
        order: 6,

        text: "هل هناك أي شيء حاليًا قد يؤثر على قدرتك على الاستمرار في متابعة علاج طفلك؟",

        type: "single",
        category: "risk_detection",
        trackKey: "continuation_barrier",

        answers: [

            {
                id: "A1",
                text: "لا يوجد شيء حاليًا",
                value: "none",
                score: 1,
                nextQuestionId: "S5-Q07"
            },

            {
                id: "A2",
                text: "هناك صعوبة بسيطة",
                value: "minor",
                score: 2,
                riskLevel: "low",
                opensFollowUp: true,
                nextQuestionId: "S5-Q06-F01"
            },

            {
                id: "A3",
                text: "هناك صعوبة واضحة",
                value: "clear",
                score: 3,
                riskLevel: "medium",
                opensFollowUp: true,
                nextQuestionId: "S5-Q06-F01"
            },

            {
                id: "A4",
                text: "هناك مشكلة كبيرة قد تؤثر على استمراري في متابعة طفلي",
                value: "major",
                score: 4,
                riskLevel: "high",
                opensFollowUp: true,
                nextQuestionId: "S5-Q06-F01"
            }
        ],

        active: true
    },


    // ==========================================
    // S5-Q06-F01
    // Continuation Barrier Reason
    // ==========================================

    {
        questionId: "S5-Q06-F01",
        sessionNumber: 5,
        questionSetVersion: 2,
        order: 6.1,

        text: "ما السبب الذي يؤثر على قدرتك على الاستمرار في متابعة علاج طفلك؟",

        type: "single",
        category: "risk_detection",
        trackKey: "continuation_barrier_type",

        dependsOn: {
            questionId: "S5-Q06",
            answerValues: [
                "minor",
                "clear",
                "major"
            ]
        },

        answers: [

            {
                id: "A1",
                text: "صعوبة في الوصول إلى العيادة أو المواصلات",
                value: "transportation_access",
                nextQuestionId: "S5-Q07"
            },

            {
                id: "A2",
                text: "العمل أو الدراسة أو ضيق الوقت",
                value: "work_study_time",
                nextQuestionId: "S5-Q07"
            },

            {
                id: "A3",
                text: "صعوبة في الالتزام بالمواعيد",
                value: "appointments",
                nextQuestionId: "S5-Q07"
            },

            {
                id: "A4",
                text: "صعوبة في مساعدة طفلي على تنفيذ الخطة أو التعليمات",
                value: "execution",
                nextQuestionId: "S5-Q07"
            },

            {
                id: "A5",
                text: "ظروف شخصية أو عائلية",
                value: "personal_family",
                nextQuestionId: "S5-Q07"
            },

            {
                id: "A6",
                text: "سبب آخر",
                value: "other",
                opensFollowUp: true,
                nextQuestionId: "S5-Q06-F02"
            }
        ],

        active: true
    },


    // ==========================================
    // S5-Q06-F02
    // Other Barrier
    // ==========================================

    {
        questionId: "S5-Q06-F02",
        sessionNumber: 5,
        questionSetVersion: 2,
        order: 6.2,

        text: "ما السبب الآخر الذي يؤثر على قدرتك على الاستمرار في متابعة علاج طفلك؟",

        type: "text",
        category: "risk_detection",
        trackKey: "continuation_barrier_details",

        dependsOn: {
            questionId: "S5-Q06-F01",
            answerValues: [
                "other"
            ]
        },

        required: true,
        active: true,

        nextQuestionId: "S5-Q07"
    },


    // ==========================================
    // S5-Q07
    // Patient / Guardian Feedback
    // ==========================================

    {
        questionId: "S5-Q07",
        sessionNumber: 5,
        questionSetVersion: 2,
        order: 7,

        text: "هل هناك شيء آخر مهم تريد أن يعرفه الفريق المعالج عن حالة طفلك الآن؟",

        type: "text",
        category: "patient_feedback",
        trackKey: "patient_feedback",

        active: true,

        nextQuestionId: null
    }

],



// =========================================================
// SESSION 6 — CHILD
// =========================================================

session6: [

    // ==========================================
    // S6-Q01
    // Main Problem
    // ==========================================

    {
        questionId: "S6-Q01",
        sessionNumber: 6,
        order: 1,
        questionSetVersion: 2,

        text: "مقارنة بالجلسة السابقة، كيف ترى حالة طفلك الآن؟",

        type: "single",
        category: "patient_state",
        trackKey: "main_problem",

        answers: [

            {
                id: "A1",
                text: "ألاحظ تحسنًا واضحًا",
                value: "clear_improvement",
                score: 1,
                nextQuestionId: "S6-Q02"
            },

            {
                id: "A2",
                text: "ألاحظ تحسنًا بسيطًا",
                value: "slight_improvement",
                score: 2,
                nextQuestionId: "S6-Q02"
            },

            {
                id: "A3",
                text: "لم ألاحظ تغيرًا واضحًا",
                value: "no_clear_change",
                score: 3,
                riskLevel: "medium",
                nextQuestionId: "S6-Q02"
            },

            {
                id: "A4",
                text: "ألاحظ أن حالة طفلي أصبحت أصعب",
                value: "worse",
                score: 4,
                riskLevel: "high",
                nextQuestionId: "S6-Q02"
            }
        ],

        active: true
    },


    // ==========================================
    // S6-Q02
    // Daily Impact
    // ==========================================

    {
        questionId: "S6-Q02",
        sessionNumber: 6,
        order: 2,
        questionSetVersion: 2,

        text: "مقارنة بالجلسة السابقة، كيف أصبح تأثير المشكلة على حياة طفلك اليومية؟",

        type: "single",
        category: "patient_state",
        trackKey: "daily_impact",

        answers: [

            {
                id: "A1",
                text: "أصبح تأثيرها أقل بكثير",
                value: "much_less",
                score: 1,
                nextQuestionId: "S6-Q03"
            },

            {
                id: "A2",
                text: "أصبح تأثيرها أقل",
                value: "less",
                score: 2,
                nextQuestionId: "S6-Q03"
            },

            {
                id: "A3",
                text: "ما زال تأثيرها كما هو تقريبًا",
                value: "same",
                score: 3,
                riskLevel: "medium",
                nextQuestionId: "S6-Q03"
            },

            {
                id: "A4",
                text: "أصبح تأثيرها أكبر من قبل",
                value: "worse",
                score: 4,
                riskLevel: "high",
                nextQuestionId: "S6-Q03"
            }
        ],

        active: true
    },


    // ==========================================
    // S6-Q03
    // Treatment Difficulty
    // ==========================================

    {
        questionId: "S6-Q03",
        sessionNumber: 6,
        order: 3,
        questionSetVersion: 2,

        text: "مقارنة بالجلسة السابقة، كيف أصبحت قدرتك على مساعدة طفلك في تنفيذ الخطة العلاجية؟",

        type: "single",
        category: "treatment_adherence",
        trackKey: "treatment_difficulty",

        answers: [

            {
                id: "A1",
                text: "أصبحت أسهل بكثير",
                value: "much_easier",
                score: 1,
                nextQuestionId: "S6-Q05"
            },

            {
                id: "A2",
                text: "أصبحت أسهل",
                value: "easier",
                score: 2,
                nextQuestionId: "S6-Q05"
            },

            {
                id: "A3",
                text: "لم تتغير وما زالت بنفس الصعوبة تقريبًا",
                value: "same",
                score: 3,
                riskLevel: "medium",
                nextQuestionId: "S6-Q05"
            },

            {
                id: "A4",
                text: "أصبحت أصعب",
                value: "worse",
                score: 4,
                riskLevel: "high",
                nextQuestionId: "S6-Q05"
            }
        ],

        active: true
    },


    // ==========================================
    // S6-Q05
    // New Problem Detection
    // ==========================================

    {
        questionId: "S6-Q05",
        sessionNumber: 6,
        order: 4,
        questionSetVersion: 2,

        text: "هل ظهرت لدى طفلك أي صعوبة جديدة مختلفة عن المشكلة التي كنا نتابعها؟",

        type: "single",
        category: "patient_state",
        trackKey: "new_problem",

        answers: [

            {
                id: "A1",
                text: "لا، لم تظهر أي صعوبة جديدة",
                value: "none",
                score: 1,
                nextQuestionId: "S6-Q06"
            },

            {
                id: "A2",
                text: "نعم، ظهرت صعوبة بسيطة",
                value: "minor",
                score: 2,
                riskLevel: "low",
                opensFollowUp: true,
                nextQuestionId: "S6-Q05-F01"
            },

            {
                id: "A3",
                text: "نعم، ظهرت صعوبة واضحة",
                value: "clear",
                score: 3,
                riskLevel: "medium",
                opensFollowUp: true,
                nextQuestionId: "S6-Q05-F01"
            },

            {
                id: "A4",
                text: "نعم، ظهرت صعوبة كبيرة",
                value: "major",
                score: 4,
                riskLevel: "high",
                opensFollowUp: true,
                nextQuestionId: "S6-Q05-F01"
            }
        ],

        active: true
    },


    // ==========================================
    // S6-Q05-F01
    // New Problem Details
    // ==========================================

    {
        questionId: "S6-Q05-F01",
        sessionNumber: 6,
        order: 4.1,
        questionSetVersion: 2,

        text: "ما الصعوبة الجديدة التي لاحظتها لدى طفلك؟",

        type: "single",
        category: "patient_state",
        trackKey: "new_problem_type",

        dependsOn: {
            questionId: "S6-Q05",
            answerValues: [
                "minor",
                "clear",
                "major"
            ]
        },

        answers: [

            {
                id: "A1",
                text: "صعوبة في تنفيذ الخطة العلاجية",
                value: "treatment_plan",
                nextQuestionId: "S6-Q06"
            },

            {
                id: "A2",
                text: "صعوبة في أداء بعض الأنشطة",
                value: "activity",
                nextQuestionId: "S6-Q06"
            },

            {
                id: "A3",
                text: "ظهور أعراض أو مشكلة أخرى",
                value: "symptoms",
                nextQuestionId: "S6-Q06"
            },

            {
                id: "A4",
                text: "شيء آخر",
                value: "other",
                opensFollowUp: true,
                nextQuestionId: "S6-Q05-F02"
            }
        ],

        active: true
    },


    // ==========================================
    // S6-Q05-F02
    // Other New Problem
    // ==========================================

    {
        questionId: "S6-Q05-F02",
        sessionNumber: 6,
        order: 4.2,
        questionSetVersion: 2,

        text: "ما الشيء الآخر الذي تلاحظه لدى طفلك؟",

        type: "text",
        category: "patient_state",
        trackKey: "new_problem_details",

        dependsOn: {
            questionId: "S6-Q05-F01",
            answerValues: [
                "other"
            ]
        },

        required: true,
        active: true,

        nextQuestionId: "S6-Q06"
    },


    // ==========================================
    // S6-Q06
    // Continuation Barrier
    // ==========================================

    {
        questionId: "S6-Q06",
        sessionNumber: 6,
        order: 5,
        questionSetVersion: 2,

        text: "هل يوجد شيء حالي قد يجعل التزامك بخطة علاج طفلك أكثر صعوبة؟",

        type: "single",
        category: "risk_detection",
        trackKey: "continuation_barrier",

        answers: [

            {
                id: "A1",
                text: "لا، لا يوجد شيء يؤثر على التزامي بالخطة",
                value: "none",
                score: 1,
                nextQuestionId: "S6-Q07"
            },

            {
                id: "A2",
                text: "نعم، توجد صعوبة بسيطة في الالتزام",
                value: "minor",
                score: 2,
                riskLevel: "low",
                opensFollowUp: true,
                nextQuestionId: "S6-Q06-F01"
            },

            {
                id: "A3",
                text: "نعم، توجد صعوبة واضحة في الالتزام",
                value: "clear",
                score: 3,
                riskLevel: "medium",
                opensFollowUp: true,
                nextQuestionId: "S6-Q06-F01"
            },

            {
                id: "A4",
                text: "نعم، توجد صعوبة كبيرة تجعل الالتزام بالخطة صعبًا جدًا",
                value: "major",
                score: 4,
                riskLevel: "high",
                opensFollowUp: true,
                nextQuestionId: "S6-Q06-F01"
            }
        ],

        active: true
    },


    // ==========================================
    // S6-Q06-F01
    // Continuation Barrier Reason
    // ==========================================

    {
        questionId: "S6-Q06-F01",
        sessionNumber: 6,
        order: 5.1,
        questionSetVersion: 2,

        text: "ما السبب الذي يجعل الالتزام بخطة علاج طفلك أكثر صعوبة؟",

        type: "single",
        category: "risk_detection",
        trackKey: "continuation_barrier_type",

        dependsOn: {
            questionId: "S6-Q06",
            answerValues: [
                "minor",
                "clear",
                "major"
            ]
        },

        answers: [

            {
                id: "A1",
                text: "صعوبة في الوصول إلى العيادة أو المواصلات",
                value: "transportation_access",
                nextQuestionId: "S6-Q07"
            },

            {
                id: "A2",
                text: "العمل أو الدراسة أو ضيق الوقت",
                value: "work_study_time",
                nextQuestionId: "S6-Q07"
            },

            {
                id: "A3",
                text: "صعوبة في الالتزام بالمواعيد",
                value: "appointments",
                nextQuestionId: "S6-Q07"
            },

            {
                id: "A4",
                text: "صعوبة في مساعدة الطفل على تنفيذ الخطة أو التعليمات",
                value: "execution",
                nextQuestionId: "S6-Q07"
            },

            {
                id: "A5",
                text: "ظروف شخصية أو عائلية",
                value: "personal_family",
                nextQuestionId: "S6-Q07"
            },

            {
                id: "A6",
                text: "سبب آخر",
                value: "other",
                opensFollowUp: true,
                nextQuestionId: "S6-Q06-F02"
            }
        ],

        active: true
    },


    // ==========================================
    // S6-Q06-F02
    // Other Barrier
    // ==========================================

    {
        questionId: "S6-Q06-F02",
        sessionNumber: 6,
        order: 5.2,
        questionSetVersion: 2,

        text: "ما السبب الآخر الذي يؤثر على قدرتك على متابعة خطة علاج طفلك؟",

        type: "text",
        category: "risk_detection",
        trackKey: "continuation_barrier_details",

        dependsOn: {
            questionId: "S6-Q06-F01",
            answerValues: [
                "other"
            ]
        },

        required: true,
        active: true,

        nextQuestionId: "S6-Q07"
    },


    // ==========================================
    // S6-Q07
    // Patient / Guardian Feedback
    // ==========================================

    {
        questionId: "S6-Q07",
        sessionNumber: 6,
        order: 6,
        questionSetVersion: 2,

        text: "هل هناك شيء آخر مهم تريد أن يعرفه الفريق المعالج عن حالة طفلك الآن؟",

        type: "text",
        category: "patient_feedback",
        trackKey: "patient_feedback",

        active: true,

        nextQuestionId: null
    }

],


// =====================================================
// SESSION 7 - VERSION 2 — CHILD
// =====================================================

session7: [

    // ==========================================
    // S7-Q01
    // Main Problem
    // ==========================================

    {
        questionId: "S7-Q01",
        sessionNumber: 7,
        order: 1,
        questionSetVersion: 2,

        text: "منذ بداية المتابعة وحتى الآن، كيف ترى حالة طفلك بشكل عام؟",

        type: "single",
        category: "patient_state",
        trackKey: "main_problem",

        answers: [

            {
                id: "A1",
                text: "ألاحظ تحسنًا واضحًا",
                value: "clear_improvement",
                score: 1,
                nextQuestionId: "S7-Q02"
            },

            {
                id: "A2",
                text: "ألاحظ تحسنًا جزئيًا",
                value: "partial_improvement",
                score: 2,
                nextQuestionId: "S7-Q02"
            },

            {
                id: "A3",
                text: "لم ألاحظ تغيرًا واضحًا",
                value: "no_clear_change",
                score: 3,
                riskLevel: "medium",
                nextQuestionId: "S7-Q02"
            },

            {
                id: "A4",
                text: "ألاحظ أن حالة طفلي أصبحت أسوأ",
                value: "worse",
                score: 4,
                riskLevel: "high",
                nextQuestionId: "S7-Q02"
            }
        ],

        active: true
    },


    // ==========================================
    // S7-Q02
    // Daily Impact
    // ==========================================

    {
        questionId: "S7-Q02",
        sessionNumber: 7,
        order: 2,
        questionSetVersion: 2,

        text: "منذ بداية المتابعة وحتى الآن، كيف أصبح تأثير المشكلة على حياة طفلك اليومية؟",

        type: "single",
        category: "patient_state",
        trackKey: "daily_impact",

        answers: [

            {
                id: "A1",
                text: "أصبح تأثيرها أقل بكثير",
                value: "much_less",
                score: 1,
                nextQuestionId: "S7-Q03"
            },

            {
                id: "A2",
                text: "أصبح تأثيرها أقل",
                value: "less",
                score: 2,
                nextQuestionId: "S7-Q03"
            },

            {
                id: "A3",
                text: "ما زال تأثيرها كما هو تقريبًا",
                value: "same",
                score: 3,
                riskLevel: "medium",
                nextQuestionId: "S7-Q03"
            },

            {
                id: "A4",
                text: "أصبح تأثيرها أكبر من قبل",
                value: "worse",
                score: 4,
                riskLevel: "high",
                nextQuestionId: "S7-Q03"
            }
        ],

        active: true
    },


    // ==========================================
    // S7-Q03
    // Activity Change
    // ==========================================

    {
        questionId: "S7-Q03",
        sessionNumber: 7,
        order: 3,
        questionSetVersion: 2,

        text: "منذ بداية المتابعة وحتى الآن، كيف أصبحت قدرة طفلك على أداء الأنشطة التي كانت صعبة عليه؟",

        type: "single",
        category: "patient_state",
        trackKey: "activity_change",

        answers: [

            {
                id: "A1",
                text: "أصبحت أسهل بكثير",
                value: "much_easier",
                score: 1,
                nextQuestionId: "S7-Q04"
            },

            {
                id: "A2",
                text: "أصبحت أسهل",
                value: "easier",
                score: 2,
                nextQuestionId: "S7-Q04"
            },

            {
                id: "A3",
                text: "ما زالت بنفس الصعوبة تقريبًا",
                value: "same",
                score: 3,
                riskLevel: "medium",
                nextQuestionId: "S7-Q04"
            },

            {
                id: "A4",
                text: "أصبحت أصعب",
                value: "worse",
                score: 4,
                riskLevel: "high",
                nextQuestionId: "S7-Q04"
            }
        ],

        active: true
    },


    // ==========================================
    // S7-Q04
    // Treatment Difficulty
    // ==========================================

    {
        questionId: "S7-Q04",
        sessionNumber: 7,
        order: 4,
        questionSetVersion: 2,

        text: "منذ بداية المتابعة وحتى الآن، كيف أصبحت قدرتك على مساعدة طفلك في الالتزام بالخطة العلاجية؟",

        type: "single",
        category: "treatment_adherence",
        trackKey: "treatment_difficulty",

        answers: [

            {
                id: "A1",
                text: "أصبحت أسهل بكثير",
                value: "much_easier",
                score: 1,
                nextQuestionId: "S7-Q06"
            },

            {
                id: "A2",
                text: "أصبحت أسهل",
                value: "easier",
                score: 2,
                nextQuestionId: "S7-Q06"
            },

            {
                id: "A3",
                text: "ما زالت كما هي تقريبًا",
                value: "same",
                score: 3,
                riskLevel: "medium",
                nextQuestionId: "S7-Q06"
            },

            {
                id: "A4",
                text: "أصبحت أصعب",
                value: "worse",
                score: 4,
                riskLevel: "high",
                nextQuestionId: "S7-Q06"
            }
        ],

        active: true
    },


    // ==========================================
    // S7-Q06
    // New Problem Detection
    // ==========================================

    {
        questionId: "S7-Q06",
        sessionNumber: 7,
        order: 5,
        questionSetVersion: 2,

        text: "هل ظهرت لدى طفلك أي صعوبة جديدة تحتاج إلى متابعة؟",

        type: "single",
        category: "patient_state",
        trackKey: "new_problem",

        answers: [

            {
                id: "A1",
                text: "لا، لم تظهر أي صعوبة جديدة",
                value: "none",
                score: 1,
                nextQuestionId: "S7-Q07"
            },

            {
                id: "A2",
                text: "نعم، ظهرت صعوبة بسيطة",
                value: "minor",
                score: 2,
                riskLevel: "low",
                opensFollowUp: true,
                nextQuestionId: "S7-Q06-F01"
            },

            {
                id: "A3",
                text: "نعم، ظهرت صعوبة واضحة",
                value: "clear",
                score: 3,
                riskLevel: "medium",
                opensFollowUp: true,
                nextQuestionId: "S7-Q06-F01"
            },

            {
                id: "A4",
                text: "نعم، ظهرت مشكلة كبيرة تؤثر على طفلي",
                value: "major",
                score: 4,
                riskLevel: "high",
                opensFollowUp: true,
                nextQuestionId: "S7-Q06-F01"
            }
        ],

        active: true
    },


    // ==========================================
    // S7-Q06-F01
    // New Problem Details
    // ==========================================

    {
        questionId: "S7-Q06-F01",
        sessionNumber: 7,
        order: 5.1,
        questionSetVersion: 2,

        text: "ما الصعوبة الجديدة التي لاحظتها لدى طفلك؟",

        type: "single",
        category: "patient_state",
        trackKey: "new_problem_type",

        dependsOn: {
            questionId: "S7-Q06",
            answerValues: [
                "minor",
                "clear",
                "major"
            ]
        },

        answers: [

            {
                id: "A1",
                text: "صعوبة في تنفيذ الخطة العلاجية",
                value: "treatment_plan",
                nextQuestionId: "S7-Q07"
            },

            {
                id: "A2",
                text: "صعوبة في أداء بعض الأنشطة",
                value: "activity",
                nextQuestionId: "S7-Q07"
            },

            {
                id: "A3",
                text: "ظهور أعراض أو مشكلة أخرى",
                value: "symptoms",
                nextQuestionId: "S7-Q07"
            },

            {
                id: "A4",
                text: "شيء آخر",
                value: "other",
                opensFollowUp: true,
                nextQuestionId: "S7-Q06-F02"
            }
        ],

        active: true
    },


    // ==========================================
    // S7-Q06-F02
    // Other New Problem
    // ==========================================

    {
        questionId: "S7-Q06-F02",
        sessionNumber: 7,
        order: 5.2,
        questionSetVersion: 2,

        text: "ما الشيء الآخر الذي تلاحظه لدى طفلك؟",

        type: "text",
        category: "patient_state",
        trackKey: "new_problem_details",

        dependsOn: {
            questionId: "S7-Q06-F01",
            answerValues: [
                "other"
            ]
        },

        required: true,
        active: true,

        nextQuestionId: "S7-Q07"
    },


    // ==========================================
    // S7-Q07
    // Continuation Barrier
    // ==========================================

    {
        questionId: "S7-Q07",
        sessionNumber: 7,
        order: 6,
        questionSetVersion: 2,

        text: "هل يوجد شيء حالي قد يجعل التزامك بخطة علاج طفلك أكثر صعوبة؟",

        type: "single",
        category: "risk_detection",
        trackKey: "continuation_barrier",

        answers: [

            {
                id: "A1",
                text: "لا، لا يوجد شيء يؤثر على التزامي بالخطة",
                value: "none",
                score: 1,
                nextQuestionId: "S7-Q08"
            },

            {
                id: "A2",
                text: "نعم، توجد صعوبة بسيطة في الالتزام",
                value: "minor",
                score: 2,
                riskLevel: "low",
                opensFollowUp: true,
                nextQuestionId: "S7-Q07-F01"
            },

            {
                id: "A3",
                text: "نعم، توجد صعوبة واضحة في الالتزام",
                value: "clear",
                score: 3,
                riskLevel: "medium",
                opensFollowUp: true,
                nextQuestionId: "S7-Q07-F01"
            },

            {
                id: "A4",
                text: "نعم، توجد صعوبة كبيرة تجعل الالتزام بخطة علاج طفلي صعبًا جدًا",
                value: "major",
                score: 4,
                riskLevel: "high",
                opensFollowUp: true,
                nextQuestionId: "S7-Q07-F01"
            }
        ],

        active: true
    },


    // ==========================================
    // S7-Q07-F01
    // Continuation Barrier Reason
    // ==========================================

    {
        questionId: "S7-Q07-F01",
        sessionNumber: 7,
        order: 6.1,
        questionSetVersion: 2,

        text: "ما السبب الذي يجعل الالتزام بخطة علاج طفلك أكثر صعوبة؟",

        type: "single",
        category: "risk_detection",
        trackKey: "continuation_barrier_type",

        dependsOn: {
            questionId: "S7-Q07",
            answerValues: [
                "minor",
                "clear",
                "major"
            ]
        },

        answers: [

            {
                id: "A1",
                text: "صعوبة في الوصول إلى العيادة أو المواصلات",
                value: "transportation_access",
                nextQuestionId: "S7-Q08"
            },

            {
                id: "A2",
                text: "العمل أو الدراسة أو ضيق الوقت",
                value: "work_study_time",
                nextQuestionId: "S7-Q08"
            },

            {
                id: "A3",
                text: "صعوبة في الالتزام بالمواعيد",
                value: "appointments",
                nextQuestionId: "S7-Q08"
            },

            {
                id: "A4",
                text: "صعوبة في مساعدة الطفل على تنفيذ الخطة أو التعليمات",
                value: "execution",
                nextQuestionId: "S7-Q08"
            },

            {
                id: "A5",
                text: "ظروف شخصية أو عائلية",
                value: "personal_family",
                nextQuestionId: "S7-Q08"
            },

            {
                id: "A6",
                text: "سبب آخر",
                value: "other",
                opensFollowUp: true,
                nextQuestionId: "S7-Q07-F02"
            }
        ],

        active: true
    },


    // ==========================================
    // S7-Q07-F02
    // Other Barrier
    // ==========================================

    {
        questionId: "S7-Q07-F02",
        sessionNumber: 7,
        order: 6.2,
        questionSetVersion: 2,

        text: "ما السبب الآخر الذي يؤثر على قدرتك على متابعة علاج طفلك؟",

        type: "text",
        category: "risk_detection",
        trackKey: "continuation_barrier_details",

        dependsOn: {
            questionId: "S7-Q07-F01",
            answerValues: [
                "other"
            ]
        },

        required: true,
        active: true,

        nextQuestionId: "S7-Q08"
    },


    // ==========================================
    // S7-Q08
    // Patient / Guardian Feedback
    // ==========================================

    {
        questionId: "S7-Q08",
        sessionNumber: 7,
        order: 7,
        questionSetVersion: 2,

        text: "هل هناك شيء آخر مهم تريد أن يعرفه الفريق المعالج عن حالة طفلك الآن؟",

        type: "text",
        category: "patient_feedback",
        trackKey: "patient_feedback",

        active: true,

        nextQuestionId: null
    }

],


// =====================================================
// SESSION 8 — VERSION 2 — CHILD
// =====================================================

session8: [

    // ==========================================
    // S8-Q01
    // Main Problem
    // ==========================================

    {
        questionId: "S8-Q01",
        sessionNumber: 8,
        order: 1,
        questionSetVersion: 2,

        text: "مقارنة بالجلسة السابقة، كيف ترى حالة طفلك الآن؟",

        type: "single",
        category: "patient_state",
        trackKey: "main_problem",

        answers: [

            {
                id: "A1",
                text: "ألاحظ تحسنًا واضحًا",
                value: "clear_improvement",
                score: 1,
                nextQuestionId: "S8-Q02"
            },

            {
                id: "A2",
                text: "ألاحظ تحسنًا بسيطًا",
                value: "slight_improvement",
                score: 2,
                nextQuestionId: "S8-Q02"
            },

            {
                id: "A3",
                text: "لم ألاحظ تغيرًا واضحًا",
                value: "same",
                score: 3,
                riskLevel: "medium",
                nextQuestionId: "S8-Q02"
            },

            {
                id: "A4",
                text: "ألاحظ أن حالة طفلي أصبحت أصعب",
                value: "worse",
                score: 4,
                riskLevel: "high",
                nextQuestionId: "S8-Q02"
            }
        ],

        active: true
    },


    // ==========================================
    // S8-Q02
    // Daily Impact
    // ==========================================

    {
        questionId: "S8-Q02",
        sessionNumber: 8,
        order: 2,
        questionSetVersion: 2,

        text: "مقارنة بالجلسة السابقة، كيف أصبح تأثير حالة طفلك على حياته اليومية؟",

        type: "single",
        category: "patient_state",
        trackKey: "daily_impact",

        answers: [

            {
                id: "A1",
                text: "أصبح تأثيرها أقل بكثير",
                value: "much_less",
                score: 1,
                nextQuestionId: "S8-Q03"
            },

            {
                id: "A2",
                text: "أصبح تأثيرها أقل",
                value: "less",
                score: 2,
                nextQuestionId: "S8-Q03"
            },

            {
                id: "A3",
                text: "ما زال تأثيرها كما هو تقريبًا",
                value: "same",
                score: 3,
                riskLevel: "medium",
                nextQuestionId: "S8-Q03"
            },

            {
                id: "A4",
                text: "أصبح تأثيرها أكبر من قبل",
                value: "worse",
                score: 4,
                riskLevel: "high",
                nextQuestionId: "S8-Q03"
            }
        ],

        active: true
    },


    // ==========================================
    // S8-Q03
    // Treatment Difficulty
    // ==========================================

    {
        questionId: "S8-Q03",
        sessionNumber: 8,
        order: 3,
        questionSetVersion: 2,

        text: "مقارنة بالجلسة السابقة، كيف أصبحت قدرتك على مساعدة طفلك في الالتزام بالخطة العلاجية؟",

        type: "single",
        category: "treatment_adherence",
        trackKey: "treatment_difficulty",

        answers: [

            {
                id: "A1",
                text: "أصبحت أسهل بكثير وأصبح من السهل علينا الالتزام بالخطة",
                value: "much_better",
                score: 1,
                nextQuestionId: "S8-Q04"
            },

            {
                id: "A2",
                text: "أصبحت أسهل وأصبح الالتزام بها أفضل",
                value: "better",
                score: 2,
                nextQuestionId: "S8-Q04"
            },

            {
                id: "A3",
                text: "ما زالت لدي بعض الصعوبة في مساعدة طفلي على الالتزام بها",
                value: "same",
                score: 3,
                riskLevel: "medium",
                nextQuestionId: "S8-Q04"
            },

            {
                id: "A4",
                text: "أصبحت لدي صعوبة أكبر في مساعدة طفلي على الالتزام بالخطة",
                value: "worse",
                score: 4,
                riskLevel: "high",
                nextQuestionId: "S8-Q04"
            }
        ],

        active: true
    },


    // ==========================================
    // S8-Q04
    // Activity Change
    // ==========================================

    {
        questionId: "S8-Q04",
        sessionNumber: 8,
        order: 4,
        questionSetVersion: 2,

        text: "مقارنة بالجلسة السابقة، كيف أصبحت قدرة طفلك على أداء الأنشطة التي كانت صعبة عليه؟",

        type: "single",
        category: "patient_state",
        trackKey: "activity_change",

        answers: [

            {
                id: "A1",
                text: "أصبحت أسهل بشكل واضح",
                value: "much_easier",
                score: 1,
                nextQuestionId: "S8-Q05"
            },

            {
                id: "A2",
                text: "أصبحت أسهل قليلًا",
                value: "easier",
                score: 2,
                nextQuestionId: "S8-Q05"
            },

            {
                id: "A3",
                text: "ما زالت بنفس الصعوبة تقريبًا",
                value: "same",
                score: 3,
                riskLevel: "medium",
                nextQuestionId: "S8-Q05"
            },

            {
                id: "A4",
                text: "أصبحت أصعب من قبل",
                value: "worse",
                score: 4,
                riskLevel: "high",
                nextQuestionId: "S8-Q05"
            }
        ],

        active: true
    },


    // ==========================================
    // S8-Q05
    // Continuation Barrier
    // ==========================================

    {
        questionId: "S8-Q05",
        sessionNumber: 8,
        order: 5,
        questionSetVersion: 2,

        text: "هل واجهت أي شيء جديد جعل متابعة علاج طفلك أو تنفيذ الخطة العلاجية أصعب عليك؟",

        type: "single",
        category: "risk_detection",
        trackKey: "continuation_barrier",

        answers: [

            {
                id: "A1",
                text: "لا، لم أواجه أي عائق جديد",
                value: "none",
                score: 1,
                nextQuestionId: "S8-Q06"
            },

            {
                id: "A2",
                text: "نعم، واجهت صعوبة بسيطة",
                value: "minor",
                score: 2,
                riskLevel: "low",
                opensFollowUp: true,
                nextQuestionId: "S8-Q05-F01"
            },

            {
                id: "A3",
                text: "نعم، واجهت صعوبة واضحة",
                value: "clear",
                score: 3,
                riskLevel: "medium",
                opensFollowUp: true,
                nextQuestionId: "S8-Q05-F01"
            },

            {
                id: "A4",
                text: "نعم، أصبحت لدي مشكلة كبيرة تؤثر على قدرتي على متابعة علاج طفلي",
                value: "major",
                score: 4,
                riskLevel: "high",
                opensFollowUp: true,
                nextQuestionId: "S8-Q05-F01"
            }
        ],

        active: true
    },


    // ==========================================
    // S8-Q05-F01
    // Continuation Barrier Reason
    // ==========================================

    {
        questionId: "S8-Q05-F01",
        sessionNumber: 8,
        order: 5.1,
        questionSetVersion: 2,

        text: "ما السبب الذي جعل متابعة علاج طفلك أو تنفيذ الخطة العلاجية أصعب عليك؟",

        type: "single",
        category: "risk_detection",
        trackKey: "continuation_barrier_type",

        dependsOn: {
            questionId: "S8-Q05",
            answerValues: [
                "minor",
                "clear",
                "major"
            ]
        },

        answers: [

            {
                id: "A1",
                text: "العمل أو الدراسة أو ضيق الوقت",
                value: "work_study_time",
                nextQuestionId: "S8-Q06"
            },

            {
                id: "A2",
                text: "صعوبة في الوصول إلى العيادة أو المواصلات",
                value: "transportation_access",
                nextQuestionId: "S8-Q06"
            },

            {
                id: "A3",
                text: "صعوبة في الالتزام بالمواعيد",
                value: "appointments",
                nextQuestionId: "S8-Q06"
            },

            {
                id: "A4",
                text: "صعوبة في مساعدة طفلي على تنفيذ الخطة أو التعليمات",
                value: "execution",
                nextQuestionId: "S8-Q06"
            },

            {
                id: "A5",
                text: "ظروف شخصية أو عائلية",
                value: "personal_family",
                nextQuestionId: "S8-Q06"
            },

            {
                id: "A6",
                text: "سبب آخر",
                value: "other",
                opensFollowUp: true,
                nextQuestionId: "S8-Q05-F02"
            }
        ],

        active: true
    },


    // ==========================================
    // S8-Q05-F02
    // Other Barrier
    // ==========================================

    {
        questionId: "S8-Q05-F02",
        sessionNumber: 8,
        order: 5.2,
        questionSetVersion: 2,

        text: "ما السبب الآخر الذي يؤثر على قدرتك على متابعة علاج طفلك؟",

        type: "text",
        category: "risk_detection",
        trackKey: "continuation_barrier_details",

        dependsOn: {
            questionId: "S8-Q05-F01",
            answerValues: [
                "other"
            ]
        },

        required: true,
        active: true,

        nextQuestionId: "S8-Q06"
    },


    // ==========================================
    // S8-Q06
    // Remaining Concern
    // ==========================================

    {
        questionId: "S8-Q06",
        sessionNumber: 8,
        order: 6,
        questionSetVersion: 2,

        text: "هل هناك شيء في حالة طفلك الحالية ترى أنه ما زال يحتاج إلى اهتمام أكبر؟",

        type: "single",
        category: "patient_state",
        trackKey: "remaining_concern",

        answers: [

            {
                id: "A1",
                text: "لا، أشعر أن الأمور تسير بشكل جيد",
                value: "none",
                score: 1,
                nextQuestionId: "S8-Q07"
            },

            {
                id: "A2",
                text: "نعم، هناك شيء بسيط يحتاج إلى تحسين",
                value: "minor",
                score: 2,
                riskLevel: "low",
                nextQuestionId: "S8-Q07"
            },

            {
                id: "A3",
                text: "نعم، هناك شيء واضح ما زال يسبب لطفلي صعوبة",
                value: "clear",
                score: 3,
                riskLevel: "medium",
                nextQuestionId: "S8-Q07"
            },

            {
                id: "A4",
                text: "نعم، هناك مشكلة كبيرة ما زالت تؤثر على طفلي",
                value: "major",
                score: 4,
                riskLevel: "high",
                nextQuestionId: "S8-Q07"
            }
        ],

        active: true
    },


    // ==========================================
    // S8-Q07
    // Patient / Guardian Feedback
    // ==========================================

    {
        questionId: "S8-Q07",
        sessionNumber: 8,
        order: 7,
        questionSetVersion: 2,

        text: "هل هناك شيء آخر مهم تريد أن يعرفه الفريق المعالج عن حالة طفلك الآن؟",

        type: "text",
        category: "patient_feedback",
        trackKey: "patient_feedback",

        active: true,

        nextQuestionId: null
    }

]
,

// =====================================================
// SESSION 9
// VERSION 2 — CHILD
// =====================================================

session9: [

    // ==========================================
    // S9-Q01
    // Main Problem
    // ==========================================

    {
        questionId: "S9-Q01",
        sessionNumber: 9,
        order: 1,
        questionSetVersion: 2,

        text: "مقارنة بالجلسة السابقة، كيف ترى حالة طفلك الآن؟",

        type: "single",
        category: "patient_state",
        trackKey: "main_problem",

        answers: [

            {
                id: "A1",
                text: "ألاحظ تحسنًا واضحًا",
                value: "clear_improvement",
                score: 1,
                nextQuestionId: "S9-Q03"
            },

            {
                id: "A2",
                text: "ألاحظ تحسنًا بسيطًا",
                value: "slight_improvement",
                score: 2,
                nextQuestionId: "S9-Q03"
            },

            {
                id: "A3",
                text: "لم ألاحظ تغيرًا واضحًا",
                value: "same",
                score: 3,
                riskLevel: "medium",
                nextQuestionId: "S9-Q03"
            },

            {
                id: "A4",
                text: "ألاحظ أن حالة طفلي أصبحت أصعب",
                value: "worse",
                score: 4,
                riskLevel: "high",
                nextQuestionId: "S9-Q03"
            }
        ],

        active: true
    },


    // ==========================================
    // S9-Q03
    // Daily Impact
    // ==========================================

    {
        questionId: "S9-Q03",
        sessionNumber: 9,
        order: 2,
        questionSetVersion: 2,

        text: "كيف أصبحت قدرة طفلك على ممارسة أنشطته اليومية مقارنة ببداية المتابعة؟",

        type: "single",
        category: "patient_state",
        trackKey: "daily_impact",

        answers: [

            {
                id: "A1",
                text: "أصبحت أفضل بشكل واضح",
                value: "much_better",
                score: 1,
                nextQuestionId: "S9-Q04"
            },

            {
                id: "A2",
                text: "أصبحت أفضل قليلًا",
                value: "better",
                score: 2,
                nextQuestionId: "S9-Q04"
            },

            {
                id: "A3",
                text: "لم ألاحظ تغيرًا واضحًا",
                value: "same",
                score: 3,
                riskLevel: "medium",
                nextQuestionId: "S9-Q04"
            },

            {
                id: "A4",
                text: "أصبحت أصعب من قبل",
                value: "worse",
                score: 4,
                riskLevel: "high",
                nextQuestionId: "S9-Q04"
            }
        ],

        active: true
    },


    // ==========================================
    // S9-Q04
    // Treatment Difficulty
    // ==========================================

    {
        questionId: "S9-Q04",
        sessionNumber: 9,
        order: 3,
        questionSetVersion: 2,

        text: "كيف ترى قدرتك على مساعدة طفلك في الالتزام بالخطة العلاجية مقارنة ببداية المتابعة؟",

        type: "single",
        category: "treatment_adherence",
        trackKey: "treatment_difficulty",

        answers: [

            {
                id: "A1",
                text: "أصبحت ألتزم بها بشكل أفضل بكثير",
                value: "much_better",
                score: 1,
                nextQuestionId: "S9-Q05"
            },

            {
                id: "A2",
                text: "أصبحت ألتزم بها بشكل أفضل",
                value: "better",
                score: 2,
                nextQuestionId: "S9-Q05"
            },

            {
                id: "A3",
                text: "لم يتغير مستوى التزامي بشكل واضح",
                value: "same",
                score: 3,
                riskLevel: "medium",
                nextQuestionId: "S9-Q05"
            },

            {
                id: "A4",
                text: "أصبحت أواجه صعوبة أكبر في الالتزام بالخطة مع طفلي",
                value: "worse",
                score: 4,
                riskLevel: "high",
                nextQuestionId: "S9-Q05"
            }
        ],

        active: true
    },


    // ==========================================
    // S9-Q05
    // Continuation Barrier
    // ==========================================

    {
        questionId: "S9-Q05",
        sessionNumber: 9,
        order: 4,
        questionSetVersion: 2,

        text: "هل يوجد حاليًا أي عائق قد يؤثر على قدرتك على متابعة علاج طفلك؟",

        type: "single",
        category: "risk_detection",
        trackKey: "continuation_barrier",

        answers: [

            {
                id: "A1",
                text: "لا يوجد أي عائق حاليًا",
                value: "none",
                score: 1,
                nextQuestionId: "S9-Q06"
            },

            {
                id: "A2",
                text: "نعم، يوجد عائق بسيط",
                value: "minor",
                score: 2,
                riskLevel: "low",
                opensFollowUp: true,
                nextQuestionId: "S9-Q05-F01"
            },

            {
                id: "A3",
                text: "نعم، يوجد عائق واضح",
                value: "clear",
                score: 3,
                riskLevel: "medium",
                opensFollowUp: true,
                nextQuestionId: "S9-Q05-F01"
            },

            {
                id: "A4",
                text: "نعم، يوجد عائق كبير يجعل متابعة علاج طفلي صعبة جدًا",
                value: "major",
                score: 4,
                riskLevel: "high",
                opensFollowUp: true,
                nextQuestionId: "S9-Q05-F01"
            }
        ],

        active: true
    },


    // ==========================================
    // S9-Q05-F01
    // Continuation Barrier Reason
    // ==========================================

    {
        questionId: "S9-Q05-F01",
        sessionNumber: 9,
        order: 4.1,
        questionSetVersion: 2,

        text: "ما السبب الذي يؤثر على قدرتك على متابعة علاج طفلك؟",

        type: "single",
        category: "risk_detection",
        trackKey: "continuation_barrier_type",

        dependsOn: {
            questionId: "S9-Q05",
            answerValues: [
                "minor",
                "clear",
                "major"
            ]
        },

        answers: [

            {
                id: "A1",
                text: "العمل أو الدراسة أو ضيق الوقت",
                value: "work_study_time",
                nextQuestionId: "S9-Q06"
            },

            {
                id: "A2",
                text: "صعوبة في الوصول إلى العيادة أو المواصلات",
                value: "transportation_access",
                nextQuestionId: "S9-Q06"
            },

            {
                id: "A3",
                text: "صعوبة في الالتزام بالمواعيد",
                value: "appointments",
                nextQuestionId: "S9-Q06"
            },

            {
                id: "A4",
                text: "صعوبة في مساعدة طفلي على تنفيذ الخطة العلاجية",
                value: "treatment_difficulty",
                nextQuestionId: "S9-Q06"
            },

            {
                id: "A5",
                text: "ظرف شخصي أو عائلي",
                value: "personal_family",
                nextQuestionId: "S9-Q06"
            },

            {
                id: "A6",
                text: "سبب آخر",
                value: "other",
                opensFollowUp: true,
                nextQuestionId: "S9-Q05-F02"
            }
        ],

        active: true
    },


    // ==========================================
    // S9-Q05-F02
    // Other Barrier
    // ==========================================

    {
        questionId: "S9-Q05-F02",
        sessionNumber: 9,
        order: 4.2,
        questionSetVersion: 2,

        text: "ما الشيء الآخر الذي يؤثر على قدرتك على متابعة علاج طفلك؟",

        type: "text",
        category: "risk_detection",
        trackKey: "continuation_barrier_details",

        dependsOn: {
            questionId: "S9-Q05-F01",
            answerValues: [
                "other"
            ]
        },

        required: true,
        active: true,

        nextQuestionId: "S9-Q06"
    },


    // ==========================================
    // S9-Q06
    // Remaining Concern
    // ==========================================

    {
        questionId: "S9-Q06",
        sessionNumber: 9,
        order: 5,
        questionSetVersion: 2,

        text: "هل هناك جانب من حالة طفلك ما زال يحتاج إلى اهتمام أكبر قبل الوصول إلى المرحلة النهائية من المتابعة؟",

        type: "single",
        category: "patient_state",
        trackKey: "remaining_concern",

        answers: [

            {
                id: "A1",
                text: "لا، أشعر أن الأمور تسير بشكل جيد",
                value: "none",
                score: 1,
                nextQuestionId: "S9-Q07"
            },

            {
                id: "A2",
                text: "نعم، هناك جانب بسيط يحتاج إلى تحسين",
                value: "minor",
                score: 2,
                riskLevel: "low",
                nextQuestionId: "S9-Q07"
            },

            {
                id: "A3",
                text: "نعم، هناك جانب واضح ما زال يسبب لطفلي صعوبة",
                value: "clear",
                score: 3,
                riskLevel: "medium",
                nextQuestionId: "S9-Q07"
            },

            {
                id: "A4",
                text: "نعم، هناك جانب كبير ما زال يؤثر على طفلي",
                value: "major",
                score: 4,
                riskLevel: "high",
                nextQuestionId: "S9-Q07"
            }
        ],

        active: true
    },


    // ==========================================
    // S9-Q07
    // New Problem Detection
    // ==========================================

    {
        questionId: "S9-Q07",
        sessionNumber: 9,
        order: 6,
        questionSetVersion: 2,

        text: "هل ظهرت لدى طفلك مشكلة أو صعوبة جديدة مختلفة عن المشكلة التي كنا نتابعها؟",

        type: "single",
        category: "patient_state",
        trackKey: "new_problem",

        answers: [

            {
                id: "A1",
                text: "لا، لم تظهر أي مشكلة جديدة",
                value: "none",
                score: 1,
                nextQuestionId: "S9-Q08"
            },

            {
                id: "A2",
                text: "نعم، ظهرت صعوبة بسيطة",
                value: "minor",
                score: 2,
                riskLevel: "low",
                opensFollowUp: true,
                nextQuestionId: "S9-Q07-F01"
            },

            {
                id: "A3",
                text: "نعم، ظهرت صعوبة واضحة",
                value: "clear",
                score: 3,
                riskLevel: "medium",
                opensFollowUp: true,
                nextQuestionId: "S9-Q07-F01"
            },

            {
                id: "A4",
                text: "نعم، ظهرت مشكلة كبيرة",
                value: "major",
                score: 4,
                riskLevel: "high",
                opensFollowUp: true,
                nextQuestionId: "S9-Q07-F01"
            }
        ],

        active: true
    },


    // ==========================================
    // S9-Q07-F01
    // New Problem Details
    // ==========================================

    {
        questionId: "S9-Q07-F01",
        sessionNumber: 9,
        order: 6.1,
        questionSetVersion: 2,

        text: "ما الصعوبة أو المشكلة الجديدة التي لاحظتها لدى طفلك؟",

        type: "text",
        category: "patient_state",
        trackKey: "new_problem_details",

        dependsOn: {
            questionId: "S9-Q07",
            answerValues: [
                "minor",
                "clear",
                "major"
            ]
        },

        required: true,
        active: true,

        nextQuestionId: "S9-Q08"
    },


    // ==========================================
    // S9-Q08
    // Patient / Guardian Feedback
    // ==========================================

    {
        questionId: "S9-Q08",
        sessionNumber: 9,
        order: 7,
        questionSetVersion: 2,

        text: "هل هناك شيء مهم تريد أن يعرفه الفريق المعالج عن حالة طفلك قبل الجلسة القادمة؟",

        type: "text",
        category: "patient_feedback",
        trackKey: "patient_feedback",

        active: true,

        nextQuestionId: null
    }

],


// =====================================================
// SESSION 10
// VERSION 2 — CHILD
// =====================================================

session10: [

    // ==========================================
    // S10-Q01
    // Main Problem
    // ==========================================

    {
        questionId: "S10-Q01",
        sessionNumber: 10,
        order: 1,
        questionSetVersion: 2,

        text: "مقارنة ببداية المتابعة، كيف ترى حالة طفلك الآن؟",

        type: "single",
        category: "patient_state",
        trackKey: "main_problem",

        answers: [

            {
                id: "A1",
                text: "ألاحظ تحسنًا واضحًا",
                value: "clear_improvement",
                score: 1,
                nextQuestionId: "S10-Q03"
            },

            {
                id: "A2",
                text: "ألاحظ تحسنًا بسيطًا",
                value: "slight_improvement",
                score: 2,
                nextQuestionId: "S10-Q03"
            },

            {
                id: "A3",
                text: "لم ألاحظ تغيرًا واضحًا",
                value: "same",
                score: 3,
                riskLevel: "medium",
                nextQuestionId: "S10-Q03"
            },

            {
                id: "A4",
                text: "ألاحظ أن حالة طفلي أصبحت أسوأ من البداية",
                value: "worse",
                score: 4,
                riskLevel: "high",
                nextQuestionId: "S10-Q03"
            }
        ],

        active: true
    },


    // ==========================================
    // S10-Q02
    // REMOVED
    // ==========================================


    // ==========================================
    // S10-Q03
    // Daily Impact
    // ==========================================

    {
        questionId: "S10-Q03",
        sessionNumber: 10,
        order: 2,
        questionSetVersion: 2,

        text: "مقارنة ببداية المتابعة، كيف أصبحت قدرة طفلك على ممارسة أنشطته اليومية؟",

        type: "single",
        category: "patient_state",
        trackKey: "daily_impact",

        answers: [

            {
                id: "A1",
                text: "أصبحت أفضل بشكل واضح",
                value: "much_better",
                score: 1,
                nextQuestionId: "S10-Q04"
            },

            {
                id: "A2",
                text: "أصبحت أفضل قليلًا",
                value: "better",
                score: 2,
                nextQuestionId: "S10-Q04"
            },

            {
                id: "A3",
                text: "لم تتغير بشكل واضح",
                value: "same",
                score: 3,
                riskLevel: "medium",
                nextQuestionId: "S10-Q04"
            },

            {
                id: "A4",
                text: "أصبحت أصعب من قبل",
                value: "worse",
                score: 4,
                riskLevel: "high",
                nextQuestionId: "S10-Q04"
            }
        ],

        active: true
    },


    // ==========================================
    // S10-Q04
    // Treatment Adherence
    // ==========================================

    {
        questionId: "S10-Q04",
        sessionNumber: 10,
        order: 3,
        questionSetVersion: 2,

        text: "كيف ترى قدرتك على مساعدة طفلك في الالتزام بالخطة العلاجية خلال فترة المتابعة؟",

        type: "single",
        category: "treatment_adherence",
        trackKey: "treatment_difficulty",

        answers: [

            {
                id: "A1",
                text: "كنت أساعده على الالتزام بالخطة بشكل جيد جدًا",
                value: "very_good",
                score: 1,
                nextQuestionId: "S10-Q05"
            },

            {
                id: "A2",
                text: "كنت أساعده على الالتزام بها بشكل جيد",
                value: "good",
                score: 2,
                nextQuestionId: "S10-Q05"
            },

            {
                id: "A3",
                text: "واجهت بعض الصعوبة في مساعدته على الالتزام",
                value: "difficulty",
                score: 3,
                riskLevel: "medium",
                nextQuestionId: "S10-Q05"
            },

            {
                id: "A4",
                text: "واجهت صعوبة كبيرة أثرت على قدرتي على مساعدته في الالتزام بالخطة",
                value: "major_difficulty",
                score: 4,
                riskLevel: "high",
                nextQuestionId: "S10-Q05"
            }
        ],

        active: true
    },


    // ==========================================
    // S10-Q05
    // Continuation Barrier
    // ==========================================

    {
        questionId: "S10-Q05",
        sessionNumber: 10,
        order: 4,
        questionSetVersion: 2,

        text: "هل يوجد حاليًا أي عائق قد يؤثر على قدرتك على متابعة علاج طفلك؟",

        type: "single",
        category: "risk_detection",
        trackKey: "continuation_barrier",

        answers: [

            {
                id: "A1",
                text: "لا يوجد أي عائق حاليًا",
                value: "none",
                score: 1,
                nextQuestionId: "S10-Q06"
            },

            {
                id: "A2",
                text: "نعم، يوجد عائق بسيط",
                value: "minor",
                score: 2,
                riskLevel: "low",
                opensFollowUp: true,
                nextQuestionId: "S10-Q05-F01"
            },

            {
                id: "A3",
                text: "نعم، يوجد عائق واضح",
                value: "clear",
                score: 3,
                riskLevel: "medium",
                opensFollowUp: true,
                nextQuestionId: "S10-Q05-F01"
            },

            {
                id: "A4",
                text: "نعم، يوجد عائق كبير يجعل متابعة علاج طفلي صعبة جدًا",
                value: "major",
                score: 4,
                riskLevel: "high",
                opensFollowUp: true,
                nextQuestionId: "S10-Q05-F01"
            }
        ],

        active: true
    },


    // ==========================================
    // S10-Q05-F01
    // Continuation Barrier Reason
    // ==========================================

    {
        questionId: "S10-Q05-F01",
        sessionNumber: 10,
        order: 4.1,
        questionSetVersion: 2,

        text: "ما السبب الذي يؤثر على قدرتك على متابعة علاج طفلك؟",

        type: "single",
        category: "risk_detection",
        trackKey: "continuation_barrier_type",

        dependsOn: {
            questionId: "S10-Q05",
            answerValues: [
                "minor",
                "clear",
                "major"
            ]
        },

        answers: [

            {
                id: "A1",
                text: "العمل أو الدراسة أو ضيق الوقت",
                value: "work_study_time",
                nextQuestionId: "S10-Q06"
            },

            {
                id: "A2",
                text: "صعوبة في الوصول إلى العيادة أو المواصلات",
                value: "transportation_access",
                nextQuestionId: "S10-Q06"
            },

            {
                id: "A3",
                text: "صعوبة في الالتزام بالمواعيد",
                value: "appointments",
                nextQuestionId: "S10-Q06"
            },

            {
                id: "A4",
                text: "صعوبة في مساعدة طفلي على تنفيذ الخطة العلاجية أو التعليمات",
                value: "treatment_difficulty",
                nextQuestionId: "S10-Q06"
            },

            {
                id: "A5",
                text: "ظروف أو مسؤوليات شخصية أو عائلية",
                value: "personal_family",
                nextQuestionId: "S10-Q06"
            },

            {
                id: "A6",
                text: "سبب آخر",
                value: "other",
                opensFollowUp: true,
                nextQuestionId: "S10-Q05-F02"
            }
        ],

        active: true
    },


    // ==========================================
    // S10-Q05-F02
    // Other Barrier
    // ==========================================

    {
        questionId: "S10-Q05-F02",
        sessionNumber: 10,
        order: 4.2,
        questionSetVersion: 2,

        text: "ما الشيء الآخر الذي يؤثر على قدرتك على متابعة علاج طفلك؟",

        type: "text",
        category: "risk_detection",
        trackKey: "continuation_barrier_details",

        dependsOn: {
            questionId: "S10-Q05-F01",
            answerValues: [
                "other"
            ]
        },

        required: true,
        active: true,

        nextQuestionId: "S10-Q06"
    },


    // ==========================================
    // S10-Q06
    // New Problem Detection
    // ==========================================

    {
        questionId: "S10-Q06",
        sessionNumber: 10,
        order: 5,
        questionSetVersion: 2,

        text: "هل ظهرت لدى طفلك أي مشكلة أو صعوبة جديدة خلال فترة المتابعة؟",

        type: "single",
        category: "patient_state",
        trackKey: "new_problem",

        answers: [

            {
                id: "A1",
                text: "لا، لم تظهر أي مشكلة جديدة",
                value: "none",
                score: 1,
                nextQuestionId: "S10-Q07"
            },

            {
                id: "A2",
                text: "نعم، ظهرت صعوبة بسيطة",
                value: "minor",
                score: 2,
                riskLevel: "low",
                opensFollowUp: true,
                nextQuestionId: "S10-Q06-F01"
            },

            {
                id: "A3",
                text: "نعم، ظهرت صعوبة واضحة",
                value: "clear",
                score: 3,
                riskLevel: "medium",
                opensFollowUp: true,
                nextQuestionId: "S10-Q06-F01"
            },

            {
                id: "A4",
                text: "نعم، ظهرت مشكلة كبيرة",
                value: "major",
                score: 4,
                riskLevel: "high",
                opensFollowUp: true,
                nextQuestionId: "S10-Q06-F01"
            }
        ],

        active: true
    },


    // ==========================================
    // S10-Q06-F01
    // New Problem Details
    // ==========================================

    {
        questionId: "S10-Q06-F01",
        sessionNumber: 10,
        order: 5.1,
        questionSetVersion: 2,

        text: "ما المشكلة أو الصعوبة الجديدة التي لاحظتها لدى طفلك؟",

        type: "text",
        category: "patient_state",
        trackKey: "new_problem_details",

        dependsOn: {
            questionId: "S10-Q06",
            answerValues: [
                "minor",
                "clear",
                "major"
            ]
        },

        required: true,
        active: true,

        nextQuestionId: "S10-Q07"
    },


    // ==========================================
    // S10-Q07
    // Remaining Concern
    // ==========================================

    {
        questionId: "S10-Q07",
        sessionNumber: 10,
        order: 6,
        questionSetVersion: 2,

        text: "هل هناك جانب من حالة طفلك ما زال يحتاج إلى اهتمام أكبر؟",

        type: "single",
        category: "patient_state",
        trackKey: "remaining_concern",

        answers: [

            {
                id: "A1",
                text: "لا، أشعر أن الأمور تسير بشكل جيد",
                value: "none",
                score: 1,
                nextQuestionId: "S10-Q08"
            },

            {
                id: "A2",
                text: "نعم، هناك جانب بسيط يحتاج إلى تحسين",
                value: "minor",
                score: 2,
                riskLevel: "low",
                nextQuestionId: "S10-Q08"
            },

            {
                id: "A3",
                text: "نعم، هناك جانب واضح ما زال يسبب لطفلي صعوبة",
                value: "clear",
                score: 3,
                riskLevel: "medium",
                nextQuestionId: "S10-Q08"
            },

            {
                id: "A4",
                text: "نعم، هناك جانب كبير ما زال يؤثر على طفلي",
                value: "major",
                score: 4,
                riskLevel: "high",
                nextQuestionId: "S10-Q08"
            }
        ],

        active: true
    },


    // ==========================================
    // S10-Q08
    // Patient / Guardian Feedback
    // ==========================================

    {
        questionId: "S10-Q08",
        sessionNumber: 10,
        order: 7,
        questionSetVersion: 2,

        text: "هل هناك شيء مهم تريد أن يعرفه الفريق المعالج عن حالة طفلك بعد هذه الفترة من المتابعة؟",

        type: "text",
        category: "patient_feedback",
        trackKey: "patient_feedback",

        active: true,

        nextQuestionId: null
    }

]
,
    },



}



module.exports = questions;