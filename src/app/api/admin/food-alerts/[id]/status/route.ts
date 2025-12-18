import { NextRequest, NextResponse } from 'next/server';
import { updateFoodAlertStatus } from '@/lib/db';

export async function PATCH(request: NextRequest) {
    try {
        const body = await request.json();
        const { id, status, assignedVolunteer, pickupPhotoUrl, deliveryPhotoUrl } = body;

        if (!id || !status) {
            return NextResponse.json(
                { error: 'Missing required fields: id and status' },
                { status: 400 }
            );
        }

        // Validate status
        const validStatuses = ['pending', 'assigned', 'picked_up', 'delivered', 'cancelled'];
        if (!validStatuses.includes(status)) {
            return NextResponse.json(
                { error: 'Invalid status. Must be: pending, assigned, picked_up, delivered, or cancelled' },
                { status: 400 }
            );
        }

        // Update in database
        await updateFoodAlertStatus(id, status as any, {
            assignedVolunteer,
            pickupPhotoUrl,
            deliveryPhotoUrl,
        });

        return NextResponse.json({
            success: true,
            message: 'Food alert status updated successfully',
        });
    } catch (error) {
        console.error('Error updating food alert status:', error);
        return NextResponse.json(
            { error: 'Failed to update status' },
            { status: 500 }
        );
    }
}
