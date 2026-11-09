"use client";
import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useAppStore } from "@/lib/store";
import { useRequireOnboarding } from "@/lib/useRequireOnboarding";
import AppShell from "@/components/layout/AppShell";
import AllergyPicker from "@/components/AllergyPicker";
import { avoidLabel } from "@/lib/allergens";
import { GOAL_LABELS, DIET_LABELS } from "@/lib/utils";
import { goalColor, computeTarget } from "@/lib/nutrition";
import { User, Plus, Trash2, ChevronRight, Zap, Package, RotateCcw, X, ChefHat } from "lucide-react";
import { cn } from "@/lib/utils";
import { toast } from "sonner";
import { useCommerceStatus } from "@/lib/mcp/useCommerceStatus";
import { LiveCommerceAdapter, type AddressOption } from "@/lib/mcp/adapter";
import type { Member, DietType, HealthGoal, Gender, ActivityLevel, Platform } from "@/lib/types";

export default function ProfilePage() {
  const router = useRouter();
  const { household, addMember, updateMember, removeMember, updateHousehold, generateWeeklyPlan } = useAppStore();
  const [showAddMember, setShowAddMember] = useState(false);
  const { status, loading: statusLoading, disconnect, refresh: refreshStatus } = useCommerceStatus();
  const [disconnecting, setDisconnecting] = useState<Platform | null>(null);

  // Read the OAuth callback's redirect params directly (not useSearchParams(),
  // to avoid forcing this page out of static rendering into a Suspense boundary).
  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const connected = params.get("connected");
    const error = params.get("connect_error");
    if (connected) toast.success(`${connected === "zepto" ? "Zepto" : "Swiggy Instamart"} connected!`);
    if (error) toast.error(`Connection failed: ${error}`);
    if (connected || error) router.replace("/profile");
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleDisconnect = async (platform: Platform) => {
    setDisconnecting(platform);
    await disconnect(platform);
    setDisconnecting(null);
    toast.success(`${platform === "zepto" ? "Zepto" : "Swiggy Instamart"} disconnected.`);
  };
  const [newMember, setNewMember] = useState<Partial<Member>>({
    name: "", age: 25, gender: "female", healthGoal: "maintenance", activityLevel: "moderate", allergies: [], dislikes: [],
  });
  const [editingAllergiesFor, setEditingAllergiesFor] = useState<string | null>(null);

  // Deep-linking here without completing onboarding leaves household null
  // (or incomplete) — bounce to onboarding instead of rendering a blank page.
  useRequireOnboarding();

  if (!household?.onboardingComplete) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[rgb(252,249,245)] gap-4">
        <div className="relative w-12 h-12 flex items-center justify-center">
          <span className="absolute inset-0 rounded-2xl border-4 border-brand-100 border-t-brand-500 animate-spin" />
          <ChefHat className="w-5 h-5 text-brand-500" />
        </div>
        <p className="text-xs font-medium text-muted-foreground animate-pulse">Redirecting…</p>
      </div>
    );
  }

  const handleAddMember = () => {
    if (!newMember.name) return;
    addMember({
      id: `member-${Date.now()}`,
      name: newMember.name!,
      age: newMember.age ?? 25,
      gender: newMember.gender as Gender ?? "female",
      weightKg: newMember.weightKg,
      heightCm: newMember.heightCm,
      healthGoal: newMember.healthGoal as HealthGoal ?? "maintenance",
      activityLevel: newMember.activityLevel as ActivityLevel ?? "moderate",
      allergies: newMember.allergies ?? [],
      dislikes: newMember.dislikes ?? [],
    });
    setShowAddMember(false);
    setNewMember({ name: "", age: 25, gender: "female", healthGoal: "maintenance", activityLevel: "moderate", allergies: [], dislikes: [] });
    toast.success("Member added! Regenerate your plan to include them.");
    const notice = useAppStore.getState().planNotice;
    if (notice) toast.warning(notice);
  };

  const handleSaveAllergies = (id: string, v: { allergies: string[]; dislikes: string[] }) => {
    updateMember(id, v);
    setEditingAllergiesFor(null);
    toast.success("Allergies saved.");
    const notice = useAppStore.getState().planNotice;
    if (notice) toast.warning(notice);
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
                          <button onClick={() => removeMember(m.id)} aria-label={`Remove ${m.name}`} className="text-gray-300 hover:text-red-500">
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
                      <div className="mt-3">
                        <label className="text-[10px] text-muted-foreground block mb-1">Diet override</label>
                        <select
                          value={m.dietOverride ?? ""}
                          onChange={(e) => updateMember(m.id, { dietOverride: e.target.value ? (e.target.value as DietType) : undefined })}
                          className="w-full border border-gray-200 rounded-lg p-2 text-xs focus:outline-none focus:ring-2 focus:ring-brand-400"
                        >
                          <option value="">Household default ({DIET_LABELS[household.dietType]})</option>
                          {(["veg", "egg", "nonveg"] as DietType[]).map((d) => (
                            <option key={d} value={d}>{DIET_LABELS[d]}</option>
                          ))}
                        </select>
                      </div>
                      {editingAllergiesFor === m.id ? (
                        <div className="mt-2">
                          <AllergyEditor
                            member={m}
                            onSave={(v) => handleSaveAllergies(m.id, v)}
                            onCancel={() => setEditingAllergiesFor(null)}
                          />
                        </div>
                      ) : (
                        <div className="flex flex-wrap items-center gap-1 mt-2">
                          {m.allergies.length === 0 && m.dislikes.length === 0 && (
                            <span className="text-[10px] text-muted-foreground">No allergies or dislikes set</span>
                          )}
                          {m.allergies.map((a) => (
                            <span key={a} className="text-[10px] bg-red-50 text-red-600 px-2 py-0.5 rounded-full">⚠ {avoidLabel(a)}</span>
                          ))}
                          {m.dislikes.map((d) => (
                            <span key={d} className="text-[10px] bg-gray-100 text-gray-500 px-2 py-0.5 rounded-full">{d}</span>
                          ))}
                          <button
                            onClick={() => setEditingAllergiesFor(m.id)}
                            className="text-xs text-brand-600 font-medium ml-1 py-1"
                          >
                            Edit allergies
                          </button>
                        </div>
                      )}
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
              platform="instamart"
              connected={status.instamart.connected}
              addressLabel={status.instamart.addressLabel}
              needsAddress={status.instamart.connected && !status.instamart.addressId}
              loading={statusLoading || disconnecting === "instamart"}
              onDisconnect={handleDisconnect}
              onAddressSelected={refreshStatus}
              color="orange"
            />
            <PlatformRow
              icon={<Zap className="w-4 h-4 text-purple-500" />}
              name="Zepto"
              platform="zepto"
              connected={status.zepto.connected}
              addressLabel={status.zepto.addressLabel}
              needsAddress={status.zepto.connected && !status.zepto.addressId}
              loading={statusLoading || disconnecting === "zepto"}
              onDisconnect={handleDisconnect}
              onAddressSelected={refreshStatus}
              color="purple"
            />
          </div>
          <p className="text-xs text-muted-foreground mt-3">
            Connect accounts for live pricing, availability, and 1-tap ordering. Orders placed while
            connected are real and binding — not a demo.
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
              <button onClick={() => setShowAddMember(false)} aria-label="Close">
                <X className="w-5 h-5 text-gray-400" />
              </button>
            </div>
            <div className="space-y-3">
              <input
                placeholder="Name"
                aria-label="Name"
                value={newMember.name ?? ""}
                onChange={(e) => setNewMember((p) => ({ ...p, name: e.target.value }))}
                className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  placeholder="Age"
                  aria-label="Age"
                  value={newMember.age ?? ""}
                  onChange={(e) => setNewMember((p) => ({ ...p, age: Number(e.target.value) }))}
                  className="border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                />
                <select
                  value={newMember.gender ?? "female"}
                  onChange={(e) => setNewMember((p) => ({ ...p, gender: e.target.value as Gender }))}
                  aria-label="Gender"
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
                aria-label="Health goal"
                className="w-full border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
              >
                {Object.entries(GOAL_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
              </select>
              <div className="grid grid-cols-2 gap-3">
                <input
                  type="number"
                  placeholder="Weight (kg, optional)"
                  aria-label="Weight in kilograms, optional"
                  value={newMember.weightKg ?? ""}
                  onChange={(e) => setNewMember((p) => ({ ...p, weightKg: e.target.value ? Number(e.target.value) : undefined }))}
                  className="border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                />
                <input
                  type="number"
                  placeholder="Height (cm, optional)"
                  aria-label="Height in centimeters, optional"
                  value={newMember.heightCm ?? ""}
                  onChange={(e) => setNewMember((p) => ({ ...p, heightCm: e.target.value ? Number(e.target.value) : undefined }))}
                  className="border border-gray-200 rounded-xl p-3 text-sm focus:outline-none focus:ring-2 focus:ring-brand-400"
                />
              </div>
              <AllergyPicker
                allergies={newMember.allergies ?? []}
                dislikes={newMember.dislikes ?? []}
                onChange={(v) => setNewMember((p) => ({ ...p, ...v }))}
              />
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

function AllergyEditor({ member, onSave, onCancel }: {
  member: Member;
  onSave: (v: { allergies: string[]; dislikes: string[] }) => void;
  onCancel: () => void;
}) {
  const [draft, setDraft] = useState({ allergies: member.allergies, dislikes: member.dislikes });
  return (
    <div className="space-y-3">
      <AllergyPicker allergies={draft.allergies} dislikes={draft.dislikes} onChange={setDraft} />
      <div className="flex gap-2">
        <button onClick={() => onSave(draft)} className="flex-1 bg-brand-500 text-white font-semibold py-2.5 rounded-xl text-sm hover:bg-brand-600">
          Save
        </button>
        <button onClick={onCancel} className="px-4 py-2.5 border border-gray-200 rounded-xl text-sm text-gray-600 hover:bg-gray-50">
          Cancel
        </button>
      </div>
    </div>
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

function PlatformRow({
  icon,
  name,
  platform,
  connected,
  addressLabel,
  needsAddress,
  loading,
  onDisconnect,
  onAddressSelected,
  color,
}: {
  icon: React.ReactNode;
  name: string;
  platform: Platform;
  connected: boolean;
  addressLabel: string | null;
  needsAddress: boolean;
  loading: boolean;
  onDisconnect: (platform: Platform) => void;
  onAddressSelected: () => void;
  color: string;
}) {
  return (
    <div>
      <div className="flex items-center gap-3">
        <div className={cn("w-8 h-8 rounded-xl flex items-center justify-center", `bg-${color}-50`)}>{icon}</div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium">{name}</p>
          <p className="text-xs text-muted-foreground truncate">
            {connected ? (addressLabel ? `Connected · ${addressLabel}` : "Connected · pick an address below") : "Demo mode"}
          </p>
        </div>
        {connected ? (
          <button
            onClick={() => onDisconnect(platform)}
            disabled={loading}
            className="text-[11px] font-semibold px-3 py-1.5 rounded-full bg-green-100 text-green-700 hover:bg-red-100 hover:text-red-600 disabled:opacity-50 transition-colors"
          >
            {loading ? "…" : "Live · Disconnect"}
          </button>
        ) : (
          <a
            href={`/api/auth/${platform}/start`}
            className="text-[11px] font-semibold px-3 py-1.5 rounded-full bg-gray-100 text-gray-600 hover:bg-brand-100 hover:text-brand-700 transition-colors"
          >
            Connect
          </a>
        )}
      </div>
      {needsAddress && <AddressPicker platform={platform} onSelected={onAddressSelected} />}
    </div>
  );
}

function AddressPicker({ platform, onSelected }: { platform: Platform; onSelected: () => void }) {
  const [addresses, setAddresses] = useState<AddressOption[] | null>(null);
  const [selecting, setSelecting] = useState(false);

  useEffect(() => {
    let cancelled = false;
    new LiveCommerceAdapter(platform)
      .listAddresses()
      .then((a) => !cancelled && setAddresses(a))
      .catch(() => !cancelled && setAddresses([]));
    return () => {
      cancelled = true;
    };
  }, [platform]);

  const handleSelect = async (addressId: string) => {
    setSelecting(true);
    try {
      let coords: { lat: number; lng: number } | undefined;
      // Instamart's get_addresses omits coordinates (privacy) but track_order
      // needs them — grab them once here, best-effort, if the browser allows.
      if (platform === "instamart" && "geolocation" in navigator) {
        coords = await new Promise((resolve) => {
          navigator.geolocation.getCurrentPosition(
            (pos) => resolve({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
            () => resolve(undefined),
            { timeout: 3000 }
          );
        });
      }
      await new LiveCommerceAdapter(platform).selectAddress(addressId, coords);
      onSelected();
    } finally {
      setSelecting(false);
    }
  };

  if (addresses === null) return <p className="text-xs text-muted-foreground pl-11 mt-1.5">Loading addresses…</p>;
  if (addresses.length === 0) {
    return <p className="text-xs text-muted-foreground pl-11 mt-1.5">No saved addresses found on this account.</p>;
  }

  return (
    <div className="space-y-1.5 mt-2 pl-11">
      {addresses.map((a) => (
        <button
          key={a.id}
          disabled={selecting}
          onClick={() => handleSelect(a.id)}
          className="w-full text-left text-xs border border-gray-200 rounded-lg px-2.5 py-1.5 hover:border-brand-400 disabled:opacity-50 transition-colors"
        >
          <span className="font-medium">{a.label}</span>{" "}
          <span className="text-muted-foreground">— {a.addressLine}</span>
        </button>
      ))}
    </div>
  );
}
