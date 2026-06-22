"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { motion, AnimatePresence } from "framer-motion";
import { ChefHat, ArrowRight, ArrowLeft, Plus, Trash2, Check } from "lucide-react";
import { useAppStore } from "@/lib/store";
import { INDIAN_STATES, GOAL_LABELS, DIET_LABELS } from "@/lib/utils";
import type { Member, DietType, HealthGoal, Gender, ActivityLevel } from "@/lib/types";

const TOTAL_STEPS = 5;

const slide = {
  initial: (dir: number) => ({ x: dir > 0 ? 60 : -60, opacity: 0 }),
  animate: { x: 0, opacity: 1 },
  exit: (dir: number) => ({ x: dir > 0 ? -60 : 60, opacity: 0 }),
};

export default function OnboardingPage() {
  const router = useRouter();
  const { setHousehold, completeOnboarding } = useAppStore();
  const [step, setStep] = useState(0);
  const [dir, setDir] = useState(1);

  // Step 1: state + diet
  const [state, setState] = useState("");
  const [stateOfOrigin, setStateOfOrigin] = useState("");
  const [dietType, setDietType] = useState<DietType>("veg");

  // Step 2-4: members
  const [members, setMembers] = useState<Member[]>([]);
  const [editingMember, setEditingMember] = useState<Partial<Member>>({
    name: "", age: 30, gender: "female", healthGoal: "maintenance",
    activityLevel: "moderate", allergies: [], dislikes: [],
  });

  // Step 5: location
  const [address, setAddress] = useState("");

  const go = (delta: number) => {
    setDir(delta);
    setStep((s) => s + delta);
  };

  const handleAddMember = () => {
    if (!editingMember.name || !editingMember.age) return;
    const m: Member = {
      id: `member-${Date.now()}`,
      name: editingMember.name!,
      age: editingMember.age!,
      gender: (editingMember.gender ?? "female") as Gender,
      healthGoal: (editingMember.healthGoal ?? "maintenance") as HealthGoal,
      activityLevel: (editingMember.activityLevel ?? "moderate") as ActivityLevel,
      allergies: [],
      dislikes: [],
    };
    setMembers((prev) => [...prev, m]);
    setEditingMember({ name: "", age: 30, gender: "female", healthGoal: "maintenance", activityLevel: "moderate", allergies: [], dislikes: [] });
  };

  const handleFinish = () => {
    const hh = {
      id: `hh-${Date.now()}`,
      name: `${members[0]?.name ?? "My"}'s Family`,
      state,
      stateOfOrigin: stateOfOrigin || undefined,
      dietType,
      members: members.length > 0 ? members : [{
        id: "default-member",
        name: "Me",
        age: 30,
        gender: "female" as Gender,
        healthGoal: "maintenance" as HealthGoal,
        activityLevel: "moderate" as ActivityLevel,
        allergies: [],
        dislikes: [],
      }],
      deliveryAddress: address || "Mumbai, Maharashtra",
      connectedPlatforms: [] as ("zepto" | "instamart")[],
      onboardingComplete: false,
    };
    setHousehold(hh);
    completeOnboarding();
    router.push("/calendar");
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-brand-50 via-white to-sage-50 flex flex-col">
      {/* Header */}
      <div className="p-6 flex items-center gap-3">
        <div className="w-9 h-9 bg-brand-500 rounded-xl flex items-center justify-center">
          <ChefHat className="w-5 h-5 text-white" />
        </div>
        <span className="text-xl font-bold text-brand-700">FreshPlate</span>
      </div>

      {/* Progress */}
      <div className="px-6 mb-6">
        <div className="flex gap-1.5">
          {Array.from({ length: TOTAL_STEPS }).map((_, i) => (
            <div key={i} className={`h-1.5 rounded-full flex-1 transition-all duration-500 ${i <= step ? "bg-brand-500" : "bg-gray-200"}`} />
          ))}
        </div>
        <p className="text-xs text-muted-foreground mt-2">Step {step + 1} of {TOTAL_STEPS}</p>
      </div>

      {/* Step content */}
      <div className="flex-1 px-6 overflow-hidden">
        <AnimatePresence mode="wait" custom={dir}>
          {step === 0 && (
            <StepWrapper key="s0" dir={dir}>
              <StepTitle title="Where are you from?" subtitle="We use your residence for availability checks and your origin to suggest authentic regional recipes." />
              <label className="block text-sm font-medium mb-2">State of residence</label>
              <select
                value={state}
                onChange={(e) => setState(e.target.value)}
                className="w-full border border-gray-200 rounded-xl p-3.5 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 mb-4"
              >
                <option value="">Select your state…</option>
                {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>

              <label className="block text-sm font-medium mb-2">State of origin <span className="text-gray-400 font-normal">(optional)</span></label>
              <select
                value={stateOfOrigin}
                onChange={(e) => setStateOfOrigin(e.target.value)}
                className="w-full border border-gray-200 rounded-xl p-3.5 bg-white text-sm focus:outline-none focus:ring-2 focus:ring-brand-400 mb-6"
              >
                <option value="">Same as residence / Skip</option>
                {INDIAN_STATES.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>

              <label className="block text-sm font-medium mb-3">Household diet</label>
              <div className="grid grid-cols-3 gap-3">
                {(["veg", "egg", "nonveg"] as DietType[]).map((d) => (
                  <button
                    key={d}
                    onClick={() => setDietType(d)}
                    className={`p-3 rounded-xl border-2 text-sm font-medium transition-all ${dietType === d ? "border-brand-500 bg-brand-50 text-brand-700" : "border-gray-200 bg-white text-gray-600"}`}
                  >
                    {d === "veg" ? "🥦" : d === "egg" ? "🥚" : "🍗"}<br />
                    <span className="text-xs">{DIET_LABELS[d]}</span>
                  </button>
                ))}
              </div>
            </StepWrapper>
          )}

          {step === 1 && (
            <StepWrapper key="s1" dir={dir}>
              <StepTitle title="Who's eating?" subtitle="Add each family member. We'll tailor the meal plan to everyone's needs." />
              {/* Member list */}
              {members.length > 0 && (
                <div className="space-y-2 mb-4">
                  {members.map((m) => (
                    <div key={m.id} className="flex items-center gap-3 bg-white border border-gray-100 rounded-xl p-3">
                      <div className="w-8 h-8 bg-brand-100 rounded-full flex items-center justify-center text-brand-700 font-semibold text-sm">
                        {m.name[0]}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-sm font-medium truncate">{m.name}</p>
                        <p className="text-xs text-muted-foreground">{m.age}y · {m.gender} · {GOAL_LABELS[m.healthGoal]}</p>
                      </div>
                      <button onClick={() => setMembers((p) => p.filter((x) => x.id !== m.id))}>
                        <Trash2 className="w-4 h-4 text-gray-400 hover:text-red-500" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
              {/* Add member form */}
              <div className="bg-white border border-dashed border-gray-200 rounded-xl p-4 space-y-3">
                <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Add a member</p>
                <div className="grid grid-cols-2 gap-3">
                  <input
                    placeholder="Name"
                    value={editingMember.name ?? ""}
                    onChange={(e) => setEditingMember((p) => ({ ...p, name: e.target.value }))}
                    className="border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                  />
                  <input
                    type="number"
                    placeholder="Age"
                    value={editingMember.age ?? ""}
                    onChange={(e) => setEditingMember((p) => ({ ...p, age: Number(e.target.value) }))}
                    className="border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                  />
                </div>
                <div className="grid grid-cols-2 gap-3">
                  <select
                    value={editingMember.gender ?? "female"}
                    onChange={(e) => setEditingMember((p) => ({ ...p, gender: e.target.value as Gender }))}
                    className="border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                  >
                    <option value="female">Female</option>
                    <option value="male">Male</option>
                    <option value="other">Other</option>
                  </select>
                  <select
                    value={editingMember.activityLevel ?? "moderate"}
                    onChange={(e) => setEditingMember((p) => ({ ...p, activityLevel: e.target.value as ActivityLevel }))}
                    className="border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                  >
                    <option value="sedentary">Sedentary</option>
                    <option value="moderate">Moderate</option>
                    <option value="active">Active</option>
                  </select>
                </div>
                <select
                  value={editingMember.healthGoal ?? "maintenance"}
                  onChange={(e) => setEditingMember((p) => ({ ...p, healthGoal: e.target.value as HealthGoal }))}
                  className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                >
                  {Object.entries(GOAL_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                </select>
                <button
                  onClick={handleAddMember}
                  disabled={!editingMember.name}
                  className="w-full flex items-center justify-center gap-2 bg-brand-50 text-brand-700 border border-brand-200 rounded-xl p-3 text-sm font-medium hover:bg-brand-100 disabled:opacity-40"
                >
                  <Plus className="w-4 h-4" /> Add Member
                </button>
              </div>
            </StepWrapper>
          )}

          {step === 2 && (
            <StepWrapper key="s2" dir={dir}>
              <StepTitle title="Health goals" subtitle="We personalise each person's portion sizes and recipe choices around their goal." />
              <div className="space-y-3">
                {members.length === 0 && (
                  <div className="text-center py-8 text-muted-foreground text-sm">
                    No members added yet. Go back to add family members.
                  </div>
                )}
                {members.map((m) => (
                  <div key={m.id} className="bg-white border border-gray-100 rounded-xl p-4">
                    <p className="font-semibold text-sm mb-3">{m.name}</p>
                    <div className="grid grid-cols-2 gap-2">
                      {(Object.keys(GOAL_LABELS) as HealthGoal[]).map((g) => (
                        <button
                          key={g}
                          onClick={() => setMembers((prev) => prev.map((x) => x.id === m.id ? { ...x, healthGoal: g } : x))}
                          className={`p-2.5 rounded-xl border text-xs font-medium text-left transition-all ${m.healthGoal === g ? "border-brand-500 bg-brand-50 text-brand-700" : "border-gray-200 text-gray-600 hover:border-gray-300"}`}
                        >
                          {m.healthGoal === g && <Check className="w-3 h-3 inline mr-1" />}
                          {GOAL_LABELS[g]}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </StepWrapper>
          )}

          {step === 3 && (
            <StepWrapper key="s3" dir={dir}>
              <StepTitle title="Delivery address" subtitle="FreshPlate checks ingredient availability at your location on Zepto and Swiggy Instamart." />
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Address / Area</label>
                  <input
                    placeholder="e.g. Koramangala, Bengaluru"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                    className="w-full border border-gray-200 rounded-xl p-3.5 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                  />
                </div>
                <div className="bg-amber-50 border border-amber-200 rounded-xl p-4 text-sm text-amber-800">
                  <p className="font-medium mb-1">Connect your accounts</p>
                  <p className="text-xs">You&apos;ll link Zepto and Swiggy accounts in the app to enable live availability and 1-tap ordering. For now we&apos;ll use demo data.</p>
                </div>
              </div>
            </StepWrapper>
          )}

          {step === 4 && (
            <StepWrapper key="s4" dir={dir}>
              <StepTitle title="You're all set!" subtitle="Here's your household summary. We'll generate your first weekly plan now." />
              <div className="space-y-4">
                <div className="bg-white border border-gray-100 rounded-2xl p-5 space-y-3">
                  <Row label="Lives in" value={state || "Not set"} />
                  <Row label="Origin" value={stateOfOrigin || state || "Not set"} />
                  <Row label="Diet" value={DIET_LABELS[dietType]} />
                  <Row label="Members" value={`${members.length} person${members.length !== 1 ? "s" : ""}`} />
                  <Row label="Delivery" value={address || "Demo mode"} />
                </div>
                {members.length > 0 && (
                  <div className="bg-sage-50 border border-sage-200 rounded-2xl p-4">
                    <p className="text-xs font-semibold text-sage-700 mb-3 uppercase tracking-wide">Members & Goals</p>
                    <div className="space-y-2">
                      {members.map((m) => (
                        <div key={m.id} className="flex items-center justify-between">
                          <span className="text-sm font-medium">{m.name} ({m.age})</span>
                          <span className="text-xs bg-sage-100 text-sage-700 px-2 py-1 rounded-full">{GOAL_LABELS[m.healthGoal]}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </StepWrapper>
          )}
        </AnimatePresence>
      </div>

      {/* Navigation buttons */}
      <div className="p-6 flex items-center gap-3">
        {step > 0 && (
          <button onClick={() => go(-1)} className="flex items-center gap-2 px-4 py-3 border border-gray-200 rounded-xl text-sm font-medium text-gray-600 hover:bg-gray-50">
            <ArrowLeft className="w-4 h-4" /> Back
          </button>
        )}
        {step < TOTAL_STEPS - 1 ? (
          <button
            onClick={() => go(1)}
            disabled={step === 0 && !state}
            className="flex-1 flex items-center justify-center gap-2 bg-brand-500 text-white px-6 py-3.5 rounded-xl text-sm font-semibold hover:bg-brand-600 disabled:opacity-40 transition-colors"
          >
            Continue <ArrowRight className="w-4 h-4" />
          </button>
        ) : (
          <button
            onClick={handleFinish}
            className="flex-1 flex items-center justify-center gap-2 bg-brand-500 text-white px-6 py-3.5 rounded-xl text-sm font-semibold hover:bg-brand-600 transition-colors"
          >
            Generate My Plan <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

function StepWrapper({ children, dir }: { children: React.ReactNode; dir: number }) {
  return (
    <motion.div
      custom={dir}
      variants={slide}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.25, ease: "easeInOut" }}
      className="h-full"
    >
      {children}
    </motion.div>
  );
}

function StepTitle({ title, subtitle }: { title: string; subtitle: string }) {
  return (
    <div className="mb-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-2">{title}</h2>
      <p className="text-sm text-muted-foreground leading-relaxed">{subtitle}</p>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1">
      <span className="text-sm text-muted-foreground">{label}</span>
      <span className="text-sm font-semibold">{value}</span>
    </div>
  );
}
