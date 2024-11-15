import type { CustomFileProps } from '$lib/types/GeneralTypes';
import type { SupabaseClient } from '@supabase/supabase-js';

export const convertBlobToCustomFileClientSide = async (
	blob: Blob,
	name: string,
	type: string
): Promise<CustomFileProps> => {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.readAsDataURL(blob); // Read the Blob as a Data URL (base64)
		reader.onload = () => {
			const base64 = reader.result as string; // This will be a base64 string
			const base64WithoutPrefix = base64.split(',')[1]; // Remove the Data URL prefix (e.g., "data:image/png;base64,")
			const file: CustomFileProps = {
				fileBase64: base64WithoutPrefix,
				name: name,
				type: type
			};
			resolve(file);
		};
		reader.onerror = (error) => reject(error);
	});
};

export const getPublicSbUrl = (
	supabase: SupabaseClient,
	bucketname: string,
	fullPath: string,
	transform?: { width: number; height?: number }
): string => {
	const { data } = supabase.storage.from(bucketname).getPublicUrl(fullPath, {
		transform: transform
			? {
					width: transform.width,
					height: transform.height
				}
			: undefined
	});

	return data.publicUrl;
};
