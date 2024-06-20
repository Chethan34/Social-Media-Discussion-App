'use server';
import {z} from 'zod';
import {auth} from '@/auth';
import type {Topic} from '@prisma/client';
import {redirect} from 'next/navigation';
import {db} from '@/db';
import paths from '@/paths';
import { revalidatePath } from 'next/cache';

const createTopicSchema = z.object({  //formValidation using zod
    name: z
    .string()
    .min(3)
    .regex(/[a-z-]/, {
        message: 'Must be lowercase letters or dashes without spaces'
    }),
    description: z.string().min(10),
});

interface CreateTopicFormState {
    errors: {
        name?:string[];
        description?:string[];
        _form?: string[];
    };
}
export async function createTopic( 
    formState:CreateTopicFormState, 
    formData:FormData
    ): Promise<CreateTopicFormState>{

        // await new Promise(resolve=> setTimeout(resolve, 2500)) //added loading spinners.

    const result = createTopicSchema.safeParse({ //safeParse of zod formValidation
        name: formData.get('name'),
        description: formData.get('description')
    });

    if (!result.success){
        return {
            errors: result.error.flatten().fieldErrors
        }
    }
    const session = await auth(); //checking if user is logged in
    if (!session || !session.user){
        return {
            errors:{
                _form:['You must be signed in to do this.']
            },
        };
    }
    let topic: Topic;
    try { //error handling
        topic = await db.topic.create({  //database creation for topic show page
            data: {
                slug: result.data.name,
                description: result.data.description,
            },
        });
    } catch(err:unknown){
        if(err instanceof Error){
            return {
                errors:{
                    _form:[err.message]
                }
            };
        } else {
            return{
                errors:{
                    _form:['Something went wrong']
                }
            }
        }

    }
    revalidatePath('/'); //revalidating path to homepage for caching
    redirect(paths.topicShow(topic.slug));  // redirected to homepage

    //TODO: revalidate the hompage
}

