
import React, { useState } from "react";
import { useSupabaseAuth } from "@/hooks/useSupabaseAuth";
import { supabase } from "@/integrations/supabase/client";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Label } from "@/components/ui/label";

const UserProfile: React.FC = () => {
  const { user, profile, setProfile, loading, signOut, refreshProfile, error, setError } = useSupabaseAuth();
  const [editing, setEditing] = useState(false);
  const [fullName, setFullName] = useState(profile?.full_name || "");
  const [username, setUsername] = useState(profile?.username || "");
  const [avatarUrl, setAvatarUrl] = useState(profile?.avatar_url || "");
  const [saving, setSaving] = useState(false);

  React.useEffect(() => {
    setFullName(profile?.full_name || "");
    setUsername(profile?.username || "");
    setAvatarUrl(profile?.avatar_url || "");
  }, [profile]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setError?.(null);
    setSaving(true);

    const { error } = await supabase.from("profiles").update({
      full_name: fullName,
      username,
      avatar_url: avatarUrl,
      updated_at: new Date().toISOString(),
    }).eq("id", user!.id);
    if (error) setError?.(error.message);
    else {
      setEditing(false);
      await refreshProfile?.();
    }
    setSaving(false);
  };

  if (loading) return null;

  if (!user) {
    return <div className="text-center text-destructive">Not logged in</div>;
  }

  return (
    <Card className="max-w-md w-full mx-auto mt-8">
      <CardHeader>
        <CardTitle>Your Profile</CardTitle>
      </CardHeader>
      <CardContent>
        {error && <div className="text-destructive text-sm mb-2">{error}</div>}
        <div className="flex flex-col items-center mb-4">
          {avatarUrl ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={avatarUrl}
              alt="Avatar"
              className="rounded-full w-20 h-20 object-cover mb-2 border-4 border-cyber-purple"
            />
          ) : (
            <div className="rounded-full w-20 h-20 bg-secondary flex items-center justify-center mb-2 text-2xl">
              {profile?.full_name?.[0] || profile?.username?.[0] || "?"}
            </div>
          )}
          <span className="font-semibold text-lg">{profile?.full_name}</span>
          <span className="text-cyber-bright-purple">@{profile?.username || "No username"}</span>
        </div>
        {editing ? (
          <form className="space-y-3" onSubmit={handleSave}>
            <div className="space-y-2">
              <Label htmlFor="fullName">Full Name</Label>
              <Input
                id="fullName"
                placeholder="Full Name"
                value={fullName}
                onChange={e => setFullName(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="username">Username</Label>
              <Input
                id="username"
                placeholder="Username"
                value={username}
                onChange={e => setUsername(e.target.value)}
              />
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="avatarUrl">Avatar URL</Label>
              <Input
                id="avatarUrl"
                placeholder="Avatar Image URL"
                value={avatarUrl}
                onChange={e => setAvatarUrl(e.target.value)}
              />
            </div>
            
            <Button className="w-full" type="submit" disabled={saving}>
              {saving ? "Saving..." : "Save"}
            </Button>
            <Button className="w-full mt-1" variant="outline" type="button" onClick={() => setEditing(false)}>
              Cancel
            </Button>
          </form>
        ) : (
          <>
            <Button className="w-full mb-2" onClick={() => setEditing(true)}>
              Edit Profile
            </Button>
            <Button className="w-full" variant="destructive" onClick={signOut}>
              Log Out
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
};

export default UserProfile;
