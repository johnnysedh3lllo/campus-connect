import React from 'react'
import Image from 'next/image'
import helpIcon from "@/public/icons/icon-info-circle.svg"
import liveChatIcon from "@/public/icons/icon-messages.svg"
import emailIcon from "@/public/icons/icon-message-red.svg"
import callUs from "@/public/icons/icon-phone.svg"

const items = [
    {
        image: helpIcon,
        title: "FAQs",
        details: "Find quick answers to the most common questions."
    },
    {
        image: liveChatIcon,
        title: "Live chat",
        details: "Get an immediate support by starting a chat"
    },
    {
        image: emailIcon,
        title: "Email us",
        details: "Drop us a message via mail, and we’ll respond promptly."
    },
    {
        image: callUs,
        title: "Call us",
        details: "Speak directly with our team for immediate assistance"
    }
]
const Support = () => {
    return (
        <section className="space-y-4">
            <h2 className='font-semibold'>Help Center</h2>
            <section className='grid grid-cols-1 md:grid-cols-2 gap-6'>
                {items.map(item => <div className='border rounded-md p-4 flex flex-col gap-2'>
                    <Image src={item.image} width={30} height={30} alt={item.title} className='aspect-square w-13' />
                    <h3 className='font-semibold leading-10 sm:leading-11'>{item.title}</h3>
                    <span className='text-gray-900'>{item.details}</span>

                </div>)}
            </section>

        </section>
    )
}

export default Support