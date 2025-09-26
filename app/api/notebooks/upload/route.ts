import { NextResponse } from "next/server";
import { createClient } from "@/lib/supabase/server";

export async function POST(request: Request) {
  try {
    console.log("🎓 Starting lecture upload...");

    const supabase = createClient();
    const { data: { user } } = await supabase.auth.getUser();

    if (!user) {
      console.error("❌ No user found in request");
      return NextResponse.json({ error: "Authentication required" }, { status: 401 });
    }

    console.log("✅ User authenticated:", user.id);

    const formData = await request.formData();
    const file = formData.get("file") as File;

    if (!file) {
      console.error("❌ No file found in request");
      return NextResponse.json({ error: "File is required" }, { status: 400 });
    }

    console.log("📁 File received:", file.name, "Size:", file.size);

    const maxSize = 50 * 1024 * 1024; // 50MB
    if (file.size > maxSize) {
      console.error("❌ File too large:", file.size);
      return NextResponse.json({ error: "File too large. Maximum size is 50MB" }, { status: 400 });
    }

    const fileExt = file.name.split('.').pop();
    const filePath = `lectures/${user.id}_${Date.now()}.${fileExt}`;

    console.log("📤 Uploading to:", filePath);

    // تحويل الملف لـ Buffer
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("lectures")
      .upload(filePath, buffer, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type || "application/octet-stream",
      });

    if (uploadError) {
      console.error("❌ Lecture upload error:", uploadError);
      return NextResponse.json({
        error: "Failed to upload lecture file",
        details: uploadError.message
      }, { status: 500 });
    }

    console.log("✅ File uploaded successfully:", uploadData.path);

    const { data: urlData } = supabase.storage
      .from("lectures")
      .getPublicUrl(filePath);

    console.log("🔗 Public URL:", urlData.publicUrl);

    const lectureData = {
      title: formData.get("title") as string || "بدون عنوان",
      description: formData.get("description") as string || "",
      subject_name: formData.get("subject_name") as string || "",
      university_name: formData.get("university_name") as string || "",
      major: formData.get("major") as string || "",
      lecture_date: formData.get("lecture_date") as string || new Date().toISOString(),
      duration_minutes: Number(formData.get("duration_minutes")) || 60,
      file_url: urlData.publicUrl,
      file_name: file.name,
      instructor_id: user.id,
      approval_status: "pending"
    };

    console.log("💾 Saving lecture data:", lectureData);

    const { data: lecture, error: lectureError } = await supabase
      .from("daily_lectures")
      .insert(lectureData)
      .select()
      .single();

    if (lectureError) {
      console.error("❌ Lecture creation error:", lectureError);
      return NextResponse.json({
        error: "Failed to save lecture",
        details: lectureError.message
      }, { status: 500 });
    }

    console.log("✅ Lecture created successfully:", lecture.id);

    return NextResponse.json({
      message: "Lecture uploaded successfully",
      data: lecture,
      file_url: urlData.publicUrl
    });

  } catch (error: any) {
    console.error("💥 Error in /api/notebooks/upload:", error);
    return NextResponse.json({
      error: "Internal server error",
      details: error.message
    }, { status: 500 });
  }
}
