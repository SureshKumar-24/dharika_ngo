import { NextRequest, NextResponse } from 'next/server';
import { updateStudentQueryStatus } from '@/lib/db';

export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, status, videoUrl } = body;

        if (!id || !status) {
            return NextResponse.json(
                { error: 'Missing required fields: id and status' },
                { status: 400 }
            );
        }

        // Validate status
        const validStatuses = ['pending', 'in_progress', 'resolved'];
        if (!validStatuses.includes(status)) {
            return NextResponse.json(
                { error: 'Invalid status. Must be: pending, in_progress, or resolved' },
                { status: 400 }
            );
        }

        // Update in database
        await updateStudentQueryStatus(id, status as any, videoUrl);

        return NextResponse.json({
            success: true,
            message: 'Student query status updated successfully',
        });
    } catch (error) {
        console.error('Error updating student query status:', error);
        return NextResponse.json(
            { error: 'Failed to update status' },
            { status: 500 }
        );
    }
}
