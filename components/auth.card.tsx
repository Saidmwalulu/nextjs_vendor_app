import React from 'react'
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from './ui/card'
import { Raleway } from 'next/font/google'

const fontRaleway = Raleway({
  subsets: ['latin'],
  weight: ['400', '500', '600', '700', '800', '900'],
  variable: '--font-raleway',
})

interface AuthCardProps {
    title: string
    logo?: React.ReactNode
    description?: React.ReactNode
    children: React.ReactNode
    footer?: React.ReactNode
}

export const AuthCard = ({title, logo, description, children, footer}: AuthCardProps) => {
  return (
    <Card className={`w-full max-w-sm mx-auto ${fontRaleway.variable}`}>
        <CardHeader className='text-2xl font-semibold text-center'>
          <div>{logo}</div>
          <CardTitle className='text-blue-500'>{title}</CardTitle>
          <CardDescription className='text-center pt-3 px-4'>{description}</CardDescription>
        </CardHeader>
        <CardContent>{children}</CardContent>
        <CardFooter>{footer}</CardFooter>
    </Card>
  )
}
