"use client";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import AppShell from "@/components/layout/AppShell";
import { GOAL_LABELS, DIET_LABELS } from "@/lib/utils";
import { goalColor, computeTarget } from "@/lib/nutrition";
import { User, Plus, Trash2, ChevronRight, Zap, Package, RotateCcw, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import type { Member, DietType, HealthGoal, Gender, ActivityLevel } from "@/lib/types";

export default function ProfilePage() {
  const router = useRouter();
  const { household, addMember, removeMember, updateHousehold, generateWeeklyPlan } = useAppStore();
  const [showAddMember, setShowAddMember] = useState(false);
  const [newMember, setNewMember] = useState<Partial<Member>>({
    name: "", age: 25, gender: "female", healthGoal: "maintenance", activityLevel: "moderate", allergies: [], dislikes: [],
  });

  if (!household) return null;

  const handleAddMember = () => {
    if (!newMember.name) return;
    addMember({
      id: `member-${Date.now()}`,
      name: newMember.name!,
      age: newMember.age ?? 25,
      gender: newMember.gender as Gender ?? "female",
      healthGoal: newMember.healthGoal as HealthGoal ?? "maintenance",
      activityLevel: newMember.activityLevel as ActivityLevel ?? "moderate",
      allergies: [],
      dislikes: [],
    });
    setShowAddMember(false);
    setNewMember({ name: "", age: 25, gender: "female", healthGoal: "maintenance", activityLevel: "moderate", allergies: [], dislikes: [] });
    toast.success("Member added! Regenerate your plan to include them.");
  };

  const handleRestart = () => {
    router.push("/onboarding");
  };

  return (
    <AppShell>
      <div className="bg-white border-b border-[rgb(235,227,215)] px-4 pt-4 pb-3 lg:px-8">
        <h1 className="text-lg font-bold">Profile & Settings</h1>
        <p className="text-xs text-muted-foreground">{household.name}</p>
      </div>

      <div className="flex-1 overflow-auto p-4 lg:px-8 space-y-5 pb-20">
        {/* Household info */}
        <Section title="Household">
          <Row label="Lives in" value={household.state} />
          {household.stateOfOrigin && <Row label="Origin" value={household.stateOfOrigin} />}
          <Row label="Diet preference" value={DIET_LABELS[household.dietType]} />
          <Row label="Delivery address" value={household.deliveryAddress || "Not set"} />
          <div className="pt-2 border-t border-gray-50">
            <label className="text-xs text-muted-foreground block mb-1.5">Change diet</label>
            <div className="flex gap-2">
              {(["veg", "egg", "nonveg"] as DietType[]).map((d) => (
                <button
                  key={d}
                  onClick={() => updateHousehold({ dietType: d })}
                  className={cn(
                    "flex-1 py-2 rounded-xl border text-xs font-medium transition-all",
                    household.dietType === d
                      ? "border-brand-500 bg-brand-50 text-brand-700"
                      : "border-gray-200 text-gray-500 hover:border-gray-300"
                  )}
                >
                  {d === "veg" ? "🥦 Veg" : d === "egg" ? "🥚 Egg" : "🍗 Non-veg"}
                </button>
              ))}
            </div>
          </div>
        </Section>

        {/* Members */}
        <div>
          <div className="flex items-center justify-between mb-3">
            <p className="text-sm font-semibold">Family Members ({household.members.length})</p>
            <button
              onClick={() => setShowAddMember(true)}
              className="flex items-center gap-1 text-xs text-brand-600 font-medium"
            >
              <Plus className="w-3.5 h-3.5" /> Add
            </button>
          </div>
          <div className="space-y-3">
            {household.members.map((m) => {
              const target = computeTarget(m);
              return (
                <div key={m.id} className="bg-white border border-gray-100 rounded-2xl p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 bg-brand-100 rounded-full flex items-center justify-center text-brand-700 font-bold text-sm flex-shrink-0">
                      {m.name[0]}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center justify-between">
                        <p className="font-semibold text-sm">{m.name}</p>
                        {household.members.length > 1 && (
                          <button onClick={() => removeMember(m.id)} className="text-gray-300 hover:text-red-500">
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        )}
                      </div>
                      <p className="text-xs text-muted-foreground">{m.age} yrs · {m.gender} · {m.activityLevel}</p>
                      <div className="mt-2">
                        <span className={cn("text-[10px] font-semibold px-2 py-0.5 rounded-full", goalColor(m.healthGoal))}>
                          {GOAL_LABELS[m.healthGoal]}
                        </span>
                      </div>
                      <div className="grid grid-cols-3 gap-2 mt-3">
                        <NutriBadge label="Calories" value={`${target.calories}`} unit="kcal" />
                        <NutriBadge label="Protein" value={`${target.proteinG}`} unit="g" />
                        <NutriBadge label="Carbs" value={`${target.carbsG}`} unit="g" />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Platform connections */}
        <Section title="Quick-Commerce">
          <div className="space-y-3">
            <PlatformRow
              icon={<Package className="w-4 h-4 text-orange-500" />}
              name="Swiggy Instamart"
              status={household.connectedPlatforms.includes("instamart") ? "connected" : "demo"}
              color="orange"
            />
            <PlatformRow
              icon={<Zap className="w-4 h-4 text-purple-500" />}
              name="Zepto"
              status={household.connectedPlatforms.includes("zepto") ? "connected" : "demo"}
              color="purple"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Connect accounts for live pricing, availability, and 1-tap ordering. Currently running on demo data.
          </p>
        </Section>

        {/* Actions */}
        <Section title="Plan">
          <button
            onClick={() => { generateWeeklyPlan(); toast.success("New plan generated!"); }}
            className="w-full flex items-center gap-3 py-3 text-sm text-left hover:text-brand-600"
          >
            <RotateCcw className="w-4 h-4 text-gray-400" />
            <span>Regenerate weekly plan</span>
            <ChevronRight className="w-4 h-4 text-gray-300 ml-auto" />
          </button>
          <div className="border-t border-gray-50">
            <button
              onClick={handleRestart}
              className="w-full flex items-center gap-3 py-3 text-sm text-left text-red-500 hover:text-red-600"
            >
              <User className="w-4 h-4" />
              <span>Restart onboarding</span>
              <ChevronRight className="w-4 h-4 ml-auto opacity-50" />
            </button>
          </div>
        </Section>

        <p className="text-center text-xs text-muted-foreground pb-4">
          FreshPlate MVP · General wellness only, not medical advice.
        </p>
      </div>

      {/* Add member modal */}
      {showAddMember && (
        <div className="fixed inset-0 z-50 flex items-end lg:items-center justify-center">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setShowAddMember(false)} />
          <div className="relative bg-white w-full lg:max-w-md rounded-t-3xl lg:rounded-3xl p-6 z-10">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold">Add Family Member</h3>
              <button onClick={() => setShowAddMember(false)}>
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="space-y-3">
              <input
                placeholder="Name"
                value={newMember.name ?? ""}
                onChange={(e) => setNewMember((p) => ({ ...p, name: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  placeholder="Age"
                  value={newMember.age ?? ""}
                  onChange={(e) => setNewMember((p) => ({ ...p, age: Number(e.target.value) }))}
                  className="border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                />
                <select
                  value={newMember.gender ?? "female"}
                  onChange={(e) => setNewMember((p) => ({ ...p, gender: e.target.value as Gender }))}
                  className="border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                >
                  <option value="female">Female</option>
                  <option value="male">Male</option>
                  <option value="other">Other</option>
                </select>
              </div>
              <select
                value={newMember.healthGoal ?? "maintenance"}
                onChange={(e) => setNewMember((p) => ({ ...p, healthGoal: e.target.value as HealthGoal }))}
                className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
              >
                {Object.entries(GOAL_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
              <button
                onClick={handleAddMember}
                disabled={!newMember.name}
                className="w-full bg-brand-500 text-white font-semibold py-3 rounded-xl text-sm hover:bg-brand-600 disabled:opacity-40"
              >
                Add Member
              </button>
            </div>
          </div>
        </div>
      )}
    </AppShell>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div>
      <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">{title}</p>
      <div className="bg-white border border-gray-100 rounded-2xl p-4 space-y-3">{children}</div>
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-sm font-medium">{value}</p>
    </div>
  );
}

function NutriBadge({ label, value, unit }: { label: string; value: string; unit: string }) {
  return (
    <div className="bg-gray-50 rounded-xl p-2 text-center">
      <p className="text-[9px] text-muted-foreground uppercase">{label}</p>
      <p className="text-xs font-bold">{value}<span className="font-normal text-[9px]"> {unit}</span></p>
    </div>
  );
}

function PlatformRow({ icon, name, status, color }: { icon: React.ReactNode; name: string; status: "connected" | "demo"; color: string }) {
  return (
    <div className="flex items-center gap-3">
      <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center", `bg-${color}-50`)}>{icon}</div>
      <div className="flex-1">
        <p className="text-sm font-medium">{name}</p>
        <p className="text-xs text-muted-foreground">{status === "connected" ? "Connected" : "Demo mode"}</p>
      </div>
      <span className={cn(
        "text-[10px] font-semibold px-2 py-1 rounded-full",
        status === "connected" ? "bg-green-100 text-green-700" : "bg-gray-100 text-gray-500"
      )}>
        {status === "connected" ? "Live" : "Demo"}
      </span>
    </div>
  );
}
