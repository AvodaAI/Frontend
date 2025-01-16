import { Button } from '@/app/components/ui/button'
import { Card } from '@/app/components/ui/card'
import { Input } from '@/app/components/ui/input'
import { Clock, Play, Plus } from 'lucide-react'
import React from 'react'

interface headerProps {
    searchTask: string;
    onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
}

const Header = ({
    searchTask, onChange
}: headerProps) => {
    return (
        <Card className='flex flex-col space-y-2 sm:flex-row sm:space-y-0 p-3 justify-between items-center my-5'>
            <div className='flex-1 sm:grid sm:grid-cols-2 lg:grid-cols-3'>
                <Input
                    placeholder="What are you working on?"
                    value={searchTask}
                    onChange={onChange
                    }
                    className="w-full border-transparent bg-muted shadow-none text-xs"
                />
            </div>
            <div className='flex space-x-3 sm:px-3'>
                <Button variant={'outline'} className='border-dashed text-blue-500 hover:text-blue-500' size={'sm'}>
                    <Plus size={18} />
                    <span>Task</span>
                </Button>
                <Button variant={'outline'} className='border-dashed px-2' size={'sm'}>
                    <Clock size={18} />
                    <span>00:00:00</span>
                </Button>

                <Button className='border-dashed' size={'sm'}>
                    <Play size={18} />
                    <span>Start</span>
                </Button>
            </div>
        </Card>
    )
}

export default Header
