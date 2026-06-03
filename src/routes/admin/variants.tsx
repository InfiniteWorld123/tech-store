import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/admin/variants')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div>Hello "/admin/variants"!</div>
}
