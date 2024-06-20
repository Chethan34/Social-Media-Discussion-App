'use server';

import {z} from 'zod';
import { revalidatePath } from "next/cache";
import {redirect} from 'next/navigation';
import {auth} from '@/auth';
import {db} from '@/db';
import paths from '@/paths';
import type { Post } from '@prisma/client';

const createPostSchema = z.object({ //formValidation
    title:z.string().min(3),
    content:z.string().min(10)
});

interface CreatePostFormstate{
    errors:{
        title?: string[],
        content?: string[],
        _form?: string[]
    }
}


export async function createPost(
    formState: CreatePostFormstate,
    formData: FormData
): Promise<CreatePostFormstate>{
    const result = createPostSchema.safeParse({
        title: formData.get('title'),
        content: formData.get('content')
    });

    if(!result.success){
        return {
            errors:result.error.flatten().fieldErrors
        };
    }

    return {
        errors: {}
    };
    //TODO: revalidate the topic show page
}