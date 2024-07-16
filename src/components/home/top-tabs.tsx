'use client'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { QueryLink } from '@/components/common/query-link'

interface TopTabsProps {
	tabkey?: string
	tabs: {
		label: string
		value: string
	}[]
}

export const TopTabs = ({ tabkey = 'feed', tabs }: TopTabsProps) => {
	return (
		<div className='flex items-center w-full border-b border-gray-300'>
			<Tabs defaultValue={tabs[0].value}>
				<TabsList className='!p-0 !bg-transparent'>
					{tabs.map(tab => (
						<TabsTrigger key={tab.value} value={tab.value} className='top-tab-item'>
							<QueryLink
								reserved
								query={{ [tabkey]: tab.value }}
								noSearch
								className='w-full h-full px-3 py-1.5'
							>
								{tab.label}
							</QueryLink>
						</TabsTrigger>
					))}
				</TabsList>
			</Tabs>
		</div>
	)
}
