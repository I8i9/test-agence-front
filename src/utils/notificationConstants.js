import { Handshake, ShieldAlert, ReceiptText, OctagonAlert, Camera, FileBadge2, Wrench ,Gauge } from 'lucide-react'

export const typeColors = {
  near_expiry: {
    bg: "#FEFCE8",
    color: "#eab308",
  },
  expired: {
    bg: "#FEF2F2",
    color: "#dc2626",
  },
  reminder: {
    bg: "#EFF6FF",
    color: "#2563eb",
  },
  recieved: {
    bg: "#F0FDF4",
    color: "#16a34a",
  },
};

export const iconMap = {
  Demande: Handshake,
  Assurance: ShieldAlert,
  Contract: ReceiptText,
  Subscription: OctagonAlert,
  Garage: Camera,
  Vignette: FileBadge2,
  Visite: Wrench,
  Kilometrage : Gauge,
  Photos : Camera,
};