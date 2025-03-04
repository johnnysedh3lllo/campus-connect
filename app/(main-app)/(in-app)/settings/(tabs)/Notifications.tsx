import React from 'react'
import { Switch } from '@/components/ui/switch'

const Notifications = () => {
    return (
        <section className="space-y-4">
            <h2 className='font-semibold'>Notification set up</h2>

            <label className='flex items-center gap-3'>
                <Switch />
                <div>
                    <h3 className='font-semibold'>Email Notification</h3>
                    <span className='text-gray-900'>Send me notification for new leads via email</span>
                </div>
            </label>

            <label className='flex items-center gap-3'>
                <Switch />
                <div>
                    <h3 className='font-semibold'>SMS Notification</h3>
                    <span className='text-gray-900'>Send me notification for new leads via email</span>
                </div>
            </label>
        </section>
    )
}

export default Notifications