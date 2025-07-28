
"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { auth } from "@/lib/firebase";
import { createUserWithEmailAndPassword, updateProfile } from "firebase/auth";
import { useToast } from "@/hooks/use-toast";
import { addUser } from "@/lib/firebase/users-admin";

export default function RegisterPage() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const router = useRouter();
  const { toast } = useToast();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      
      // Update Firebase Auth profile
      await updateProfile(user, {
        displayName: `${firstName} ${lastName}`
      });

      // Add user to Firestore 'users' collection
      await addUser({
        uid: user.uid,
        name: `${firstName} ${lastName}`,
        email: user.email!,
        role: 'user',
      });

      toast({ title: "Success", description: "Account created successfully." });
      router.push("/");
    } catch (error: any) {
      if (error.code === 'auth/email-already-in-use') {
        toast({
            variant: "destructive",
            title: "Registration Failed",
            description: "An account with this email already exists. Please login instead.",
        });
      } else {
        toast({ variant: "destructive", title: "Registration Failed", description: error.message });
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-200px)] py-12">
      <Card className="mx-auto max-w-sm w-full">
         <CardHeader className="text-center">
           <Link href="/" className="flex items-center justify-center gap-2 mb-4">
             <span className="font-bold font-headline text-2xl">SK Skates</span>
          </Link>
          <CardTitle className="text-2xl font-headline">Create an Account</CardTitle>
          <CardDescription>
            Enter your information to get started with SK Skates.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleRegister}>
            <div className="grid gap-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="grid gap-2">
                  <Label htmlFor="first-name">First name</Label>
                  <Input id="first-name" placeholder="Max" required value={firstName} onChange={e => setFirstName(e.target.value)} />
                </div>
                <div className="grid gap-2">
                  <Label htmlFor="last-name">Last name</Label>
                  <Input id="last-name" placeholder="Robinson" required value={lastName} onChange={e => setLastName(e.target.value)} />
                </div>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input
                  id="email"
                  type="email"
                  placeholder="m@example.com"
                  required
                  value={email}
                  onChange={e => setEmail(e.target.value)}
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="password">Password</Label>
                <Input id="password" type="password" required value={password} onChange={e => setPassword(e.target.value)} />
              </div>
              <Button type="submit" className="w-full">
                Create an account
              </Button>
            </div>
          </form>
          <div className="mt-4 text-center text-sm">
            Already have an account?{" "}
            <Link href="/login" className="underline">
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
