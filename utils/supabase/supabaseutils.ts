import { SupabaseClient } from "@supabase/supabase-js";
// import { cookies } from "next/headers";
// import { createClient } from "@/utils/supabase/server";
import { Reference } from "@/utils/global";

//获取用户id
export async function getUser(supabase: SupabaseClient) {
  const { data, error } = await supabase.auth.getSession();
  if (data.session) {
    const user = data.session.user;
    if (user) {
      // console.log("User UUID in getUser:", user.id);
      return user;
    } else {
      console.log("No user in getUser");
      return null;
    }
  } else {
    console.log("No session in getUser");
    return null;
  }
}

//将论文保存到服务器
export async function submitPaper(
  supabase: SupabaseClient,
  editorContent: string,
  references: Reference[],
  paperNumber: string
) {
  const user = await getUser(supabase);
  if (user) {
    try {
      // console.log(user.id, editorContent, references);
      const response = await fetch("/api/supa/data", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          userId: user.id,
          paperContent: editorContent,
          paperReference: references,
          paperNumber,
        }),
      });
      const data = await response.json();
      // 处理响应数据
      console.log(
        "Response data in submitPaper:",
        data,
        `此次更新的是第${paperNumber}篇论文`
      );
      return data;
    } catch (error) {
      // 错误处理
      console.error("Error submitting paper in submitPaper:", error);
    }
  } else {
    console.log(
      "No user found. User must be logged in to submit a paper. in submitPaper"
    );
  }
}
//添加某指定用户id下的论文

//删除指定用户下paperNumber的论文

//获取用户论文
// export async function getUserPapers(userId: string, supabase: SupabaseClient) {
//   const { data, error } = await supabase
//     .from("user_paper") // 指定表名
//     .select("*") // 选择所有列
//     .eq("user_id", userId); // 筛选特定user_id的记录

//   if (error) {
//     console.error("查询出错", error);
//     return null;
//   }

//   return data; // 返回查询结果
// }
// 假设在一个React组件中调用此函数
// export async function getUserPapers(userId) {
//   try {
//     const response = await fetch("/api/supa/user-papers", {
//       method: "POST",
//       headers: {
//         "Content-Type": "application/json",
//       },
//       body: JSON.stringify({ userId }),
//     });
//     const data = await response.json();
//     if (response.ok) {
//       console.log("获取到的用户论文数据:", data);
//       return data; // 返回查询结果
//     } else {
//       console.error("获取用户论文时发生错误:", data.error);
//       return null;
//     }
//   } catch (error) {
//     console.error("请求出错", error);
//     return null;
//   }
// }

// 获取用户论文的序号
// export async function getUserPaperNumbers(
//   userId: string,
//   supabase: SupabaseClient
// ) {
//   const { data, error } = await supabase
//     .from("user_paper") // 指定表名
//     .select("paper_number") // 仅选择paper_number列
//     .eq("user_id", userId); // 筛选特定user_id的记录

//   if (error) {
//     console.error("查询出错", error);
//     return null;
//   }

//   // 返回查询结果，即所有论文的序号
//   return data.map((paper) => paper.paper_number);
// }

export async function getUserPaperNumbers(userId: string) {
  try {
    const response = await fetch("/api/supa/paper-numbers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId }),
    });
    const data = await response.json();
    if (response.ok) {
      // 返回查询结果，即所有论文的序号
      console.log("获取到的用户论文数量:", data);
      return data.map((paper: any) => paper.paper_number);
    } else {
      console.error("获取用户论文数量时发生错误:", data);
      return null;
    }
  } catch (error) {
    console.error("请求出错", error);
    return null;
  }
}
// 获取用户指定序号论文的内容
// export async function getUserPaper(
//   userId: string,
//   paperNumber: string,
//   supabase: SupabaseClient
// ) {
//   const { data, error } = await supabase
//     .from("user_paper") // 指定表名
//     .select("paper_content,paper_reference") // 仅选择paper_content列
//     .eq("user_id", userId) // 筛选特定user_id的记录
//     .eq("paper_number", paperNumber)
//     .single(); // 筛选特定paper_number的记录

//   if (error) {
//     console.error("查询出错", error);
//     return null;
//   }

//   // 返回查询结果，即指定论文的内容
//   return data;
// }

export async function getUserPaper(userId: string, paperNumber: string) {
  try {
    const response = await fetch("/api/supa/user-papers", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ userId, paperNumber }),
    });
    const data = await response.json();
    if (response.ok) {
      console.log("获取到的用户论文数据:", data);
      return data; // 返回查询结果
    } else {
      console.error("获取用户论文时发生错误:", data);
      return null;
    }
  } catch (error) {
    console.error("请求出错", error);
    return null;
  }
}

//Super base的表
// create table
// public."user_paper" (
//   id bigint generated by default as identity,
//   created_at timestamp with time zone not null default now(),
//   user_id UUID REFERENCES auth.users NOT NULL,
//   paper_content character varying[] null,
//   paper_reference character varying[] null,
//   constraint userPaper_pkey primary key (id)
// ) tablespace pg_default;
//获取和用户ID相关联的论文
