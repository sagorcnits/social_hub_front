import { createFileRoute } from '@tanstack/solid-router'
import { Button } from '~/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '~/components/ui/card'
import { Input } from '~/components/ui/input'
import { Label } from '~/components/ui/label'
import { Badge } from '~/components/ui/badge'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '~/components/ui/dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '~/components/ui/dropdown-menu'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '~/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '~/components/ui/tabs'
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from '~/components/ui/tooltip'

export const Route = createFileRoute('/ui')({ component: UiShowcase })

function UiShowcase() {
  return (
    <main class="page-wrap px-4 pb-16 pt-10">
      <h1 class="mb-6 text-2xl font-bold">shadcn-solid components</h1>

      <div class="grid gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Buttons & Badges</CardTitle>
            <CardDescription>Variant showcase.</CardDescription>
          </CardHeader>
          <CardContent class="flex flex-wrap items-center gap-3">
            <Button>Default</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="destructive">Destructive</Button>
            <Button variant="outline">Outline</Button>
            <Button variant="ghost">Ghost</Button>
            <Button variant="link">Link</Button>
            <Badge>Badge</Badge>
            <Badge variant="secondary">Secondary</Badge>
            <Badge variant="outline">Outline</Badge>
          </CardContent>
          <CardFooter>
            <Tooltip>
              <TooltipTrigger as={Button} variant="outline">
                Hover me
              </TooltipTrigger>
              <TooltipContent>Tooltip content</TooltipContent>
            </Tooltip>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Form</CardTitle>
          </CardHeader>
          <CardContent class="grid max-w-sm gap-3">
            <div class="grid gap-1.5">
              <Label for="email">Email</Label>
              <Input id="email" type="email" placeholder="you@example.com" />
            </div>
            <Select<string>
              options={['Solid', 'React', 'Vue']}
              placeholder="Pick a framework"
              itemComponent={(props) => (
                <SelectItem item={props.item}>{props.item.rawValue}</SelectItem>
              )}
            >
              <SelectTrigger class="w-full">
                <SelectValue<string>>
                  {(state) => state.selectedOption()}
                </SelectValue>
              </SelectTrigger>
              <SelectContent />
            </Select>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Overlays</CardTitle>
          </CardHeader>
          <CardContent class="flex flex-wrap gap-3">
            <Dialog>
              <DialogTrigger as={Button}>Open dialog</DialogTrigger>
              <DialogContent>
                <DialogHeader>
                  <DialogTitle>Dialog title</DialogTitle>
                  <DialogDescription>
                    A Kobalte-backed modal dialog.
                  </DialogDescription>
                </DialogHeader>
                <DialogFooter>
                  <Button>Save</Button>
                </DialogFooter>
              </DialogContent>
            </Dialog>

            <DropdownMenu>
              <DropdownMenuTrigger as={Button} variant="outline">
                Menu
              </DropdownMenuTrigger>
              <DropdownMenuContent>
                <DropdownMenuLabel>Account</DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem>Profile</DropdownMenuItem>
                <DropdownMenuItem>Settings</DropdownMenuItem>
                <DropdownMenuItem>Log out</DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Tabs</CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="one">
              <TabsList>
                <TabsTrigger value="one">One</TabsTrigger>
                <TabsTrigger value="two">Two</TabsTrigger>
              </TabsList>
              <TabsContent value="one">First panel.</TabsContent>
              <TabsContent value="two">Second panel.</TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </main>
  )
}
