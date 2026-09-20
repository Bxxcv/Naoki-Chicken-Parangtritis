# ROLES & PERMISSIONS

## Roles
### OWNER
Full access for the Parangtritis outlet.

### ADMIN
Daily operational management excluding ownership/security operations.

### CASHIER
Orders, POS, payment recording, cash session, limited customer lookup.

### KITCHEN
Order queue and operational status only.

## Principle
RBAC is not a frontend-only feature. Enforce authorization server-side using Supabase RLS/policies and/or server-side privileged functions where required.

## MVP permission matrix
| Area | OWNER | ADMIN | CASHIER | KITCHEN |
|---|---:|---:|---:|---:|
| Dashboard | RW | RW | R | R |
| Orders | RW | RW | RW | R/U status |
| POS | RW | RW | RW | - |
| Kitchen | RW | RW | - | RW status |
| Products | RW | RW | R | R |
| Stock | RW | RW | R | R |
| Customers | RW | RW | R | - |
| Expenses | RW | RW | limited create | - |
| Payments config | RW | limited | R | - |
| Reports | RW | RW | limited | limited |
| Analytics | RW | R | R | - |
| Staff | RW | limited | - | - |
| Settings | RW | limited | - | - |

RW = read/write. R = read. U = update allowed fields only.
