export interface ParsedSchool {
  id: string
  name: string
  imageUrl: string
  acceptanceRate: number
  location: string
  type: "Boarding" | "Day" | "Boarding/Day"
  ranking?: number
  websiteUrl: string
}

// Map of known schools with their data
const SCHOOL_DATA: Record<string, Omit<ParsedSchool, 'id'>> = {
  "Phillips Exeter Academy": {
    name: "Phillips Exeter Academy",
    imageUrl: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80",
    acceptanceRate: 15,
    location: "Exeter, NH",
    type: "Boarding",
    ranking: 1,
    websiteUrl: "https://www.exeter.edu"
  },
  "Phillips Academy Andover": {
    name: "Phillips Academy Andover",
    imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80",
    acceptanceRate: 13,
    location: "Andover, MA",
    type: "Boarding",
    ranking: 2,
    websiteUrl: "https://www.andover.edu"
  },
  "Choate Rosemary Hall": {
    name: "Choate Rosemary Hall",
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80",
    acceptanceRate: 16,
    location: "Wallingford, CT",
    type: "Boarding",
    ranking: 3,
    websiteUrl: "https://www.choate.edu"
  },
  "Deerfield Academy": {
    name: "Deerfield Academy",
    imageUrl: "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=800&q=80",
    acceptanceRate: 17,
    location: "Deerfield, MA",
    type: "Boarding",
    ranking: 4,
    websiteUrl: "https://www.deerfield.edu"
  },
  "The Hotchkiss School": {
    name: "The Hotchkiss School",
    imageUrl: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=800&q=80",
    acceptanceRate: 21,
    location: "Lakeville, CT",
    type: "Boarding",
    ranking: 5,
    websiteUrl: "https://www.hotchkiss.org"
  },
  "The Lawrenceville School": {
    name: "The Lawrenceville School",
    imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80",
    acceptanceRate: 20,
    location: "Lawrenceville, NJ",
    type: "Boarding",
    ranking: 6,
    websiteUrl: "https://www.lawrenceville.org"
  },
  "St. Paul's School": {
    name: "St. Paul's School",
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80",
    acceptanceRate: 16,
    location: "Concord, NH",
    type: "Boarding",
    ranking: 7,
    websiteUrl: "https://www.sps.edu"
  },
  "Groton School": {
    name: "Groton School",
    imageUrl: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80",
    acceptanceRate: 12,
    location: "Groton, MA",
    type: "Boarding",
    ranking: 8,
    websiteUrl: "https://www.groton.org"
  },
  "Milton Academy": {
    name: "Milton Academy",
    imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80",
    acceptanceRate: 18,
    location: "Milton, MA",
    type: "Boarding/Day",
    ranking: 9,
    websiteUrl: "https://www.milton.edu"
  },
  "Middlesex School": {
    name: "Middlesex School",
    imageUrl: "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=800&q=80",
    acceptanceRate: 18,
    location: "Concord, MA",
    type: "Boarding",
    ranking: 10,
    websiteUrl: "https://www.mxschool.edu"
  },
  "The Taft School": {
    name: "The Taft School",
    imageUrl: "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80",
    acceptanceRate: 22,
    location: "Watertown, CT",
    type: "Boarding",
    ranking: 11,
    websiteUrl: "https://www.taftschool.org"
  },
  "St. Mark's School": {
    name: "St. Mark's School",
    imageUrl: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80",
    acceptanceRate: 25,
    location: "Southborough, MA",
    type: "Boarding",
    ranking: 12,
    websiteUrl: "https://www.stmarksschool.org"
  },
  "Peddie School": {
    name: "Peddie School",
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80",
    acceptanceRate: 22,
    location: "Hightstown, NJ",
    type: "Boarding",
    ranking: 13,
    websiteUrl: "https://www.peddie.org"
  },
  "The Loomis Chaffee School": {
    name: "The Loomis Chaffee School",
    imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80",
    acceptanceRate: 27,
    location: "Windsor, CT",
    type: "Boarding/Day",
    ranking: 14,
    websiteUrl: "https://www.loomischaffee.org"
  },
  "Blair Academy": {
    name: "Blair Academy",
    imageUrl: "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=800&q=80",
    acceptanceRate: 25,
    location: "Blairstown, NJ",
    type: "Boarding",
    ranking: 15,
    websiteUrl: "https://www.blair.edu"
  },
  "Episcopal High School": {
    name: "Episcopal High School",
    imageUrl: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=800&q=80",
    acceptanceRate: 30,
    location: "Alexandria, VA",
    type: "Boarding",
    ranking: 16,
    websiteUrl: "https://www.episcopalhighschool.org"
  },
  "The Hill School": {
    name: "The Hill School",
    imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80",
    acceptanceRate: 32,
    location: "Pottstown, PA",
    type: "Boarding",
    ranking: 17,
    websiteUrl: "https://www.thehill.org"
  },
  "Kent School": {
    name: "Kent School",
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80",
    acceptanceRate: 28,
    location: "Kent, CT",
    type: "Boarding",
    ranking: 18,
    websiteUrl: "https://www.kent-school.edu"
  },
  "Cate School": {
    name: "Cate School",
    imageUrl: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80",
    acceptanceRate: 24,
    location: "Carpinteria, CA",
    type: "Boarding",
    ranking: 19,
    websiteUrl: "https://www.cate.org"
  },
  "The Thacher School": {
    name: "The Thacher School",
    imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80",
    acceptanceRate: 19,
    location: "Ojai, CA",
    type: "Boarding",
    ranking: 20,
    websiteUrl: "https://www.thacher.org"
  },
  "Georgetown Preparatory School": {
    name: "Georgetown Preparatory School",
    imageUrl: "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=800&q=80",
    acceptanceRate: 23,
    location: "North Bethesda, MD",
    type: "Boarding/Day",
    ranking: 21,
    websiteUrl: "https://www.gprep.org"
  },
  "Brooks School": {
    name: "Brooks School",
    imageUrl: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=800&q=80",
    acceptanceRate: 25,
    location: "North Andover, MA",
    type: "Boarding",
    ranking: 22,
    websiteUrl: "https://www.brooksschool.org"
  },
  "Suffield Academy": {
    name: "Suffield Academy",
    imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80",
    acceptanceRate: 29,
    location: "Suffield, CT",
    type: "Boarding/Day",
    ranking: 23,
    websiteUrl: "https://www.suffieldacademy.org"
  },
  "Westminster School": {
    name: "Westminster School",
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80",
    acceptanceRate: 26,
    location: "Simsbury, CT",
    type: "Boarding/Day",
    ranking: 24,
    websiteUrl: "https://www.westminster-school.org"
  },
  "Emma Willard School": {
    name: "Emma Willard School",
    imageUrl: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80",
    acceptanceRate: 29,
    location: "Troy, NY",
    type: "Boarding",
    ranking: 25,
    websiteUrl: "https://www.emmawillard.org"
  },
  "Miss Porter's School": {
    name: "Miss Porter's School",
    imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80",
    acceptanceRate: 28,
    location: "Farmington, CT",
    type: "Boarding",
    ranking: 26,
    websiteUrl: "https://www.porters.org"
  },
  "Northfield Mount Hermon": {
    name: "Northfield Mount Hermon",
    imageUrl: "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=800&q=80",
    acceptanceRate: 31,
    location: "Gill, MA",
    type: "Boarding",
    ranking: 27,
    websiteUrl: "https://www.nmhschool.org"
  },
  "Mercersburg Academy": {
    name: "Mercersburg Academy",
    imageUrl: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=800&q=80",
    acceptanceRate: 30,
    location: "Mercersburg, PA",
    type: "Boarding",
    ranking: 28,
    websiteUrl: "https://www.mercersburg.edu"
  },
  "The Hun School of Princeton": {
    name: "The Hun School of Princeton",
    imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80",
    acceptanceRate: 35,
    location: "Princeton, NJ",
    type: "Boarding/Day",
    ranking: 29,
    websiteUrl: "https://www.hunschool.org"
  },
  "Berkshire School": {
    name: "Berkshire School",
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80",
    acceptanceRate: 33,
    location: "Sheffield, MA",
    type: "Boarding",
    ranking: 30,
    websiteUrl: "https://www.berkshireschool.org"
  },
  "Concord Academy": {
    name: "Concord Academy",
    imageUrl: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80",
    acceptanceRate: 28,
    location: "Concord, MA",
    type: "Boarding/Day",
    ranking: 31,
    websiteUrl: "https://www.concordacademy.org"
  },
  "Dana Hall School": {
    name: "Dana Hall School",
    imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80",
    acceptanceRate: 32,
    location: "Wellesley, MA",
    type: "Boarding/Day",
    ranking: 32,
    websiteUrl: "https://www.danahall.org"
  },
  "Tabor Academy": {
    name: "Tabor Academy",
    imageUrl: "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=800&q=80",
    acceptanceRate: 34,
    location: "Marion, MA",
    type: "Boarding/Day",
    ranking: 33,
    websiteUrl: "https://www.taboracademy.org"
  },
  "The Masters School": {
    name: "The Masters School",
    imageUrl: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=800&q=80",
    acceptanceRate: 36,
    location: "Dobbs Ferry, NY",
    type: "Boarding/Day",
    ranking: 34,
    websiteUrl: "https://www.mastersny.org"
  },
  "Pomfret School": {
    name: "Pomfret School",
    imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80",
    acceptanceRate: 38,
    location: "Pomfret, CT",
    type: "Boarding",
    ranking: 35,
    websiteUrl: "https://www.pomfretschool.org"
  },
  "Holderness School": {
    name: "Holderness School",
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80",
    acceptanceRate: 40,
    location: "Plymouth, NH",
    type: "Boarding",
    ranking: 36,
    websiteUrl: "https://www.holderness.org"
  },
  "Cranbrook Schools": {
    name: "Cranbrook Schools",
    imageUrl: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80",
    acceptanceRate: 38,
    location: "Bloomfield Hills, MI",
    type: "Boarding/Day",
    ranking: 37,
    websiteUrl: "https://schools.cranbrook.edu"
  },
  "Western Reserve Academy": {
    name: "Western Reserve Academy",
    imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80",
    acceptanceRate: 35,
    location: "Hudson, OH",
    type: "Boarding",
    ranking: 38,
    websiteUrl: "https://www.wra.net"
  },
  "Culver Academies": {
    name: "Culver Academies",
    imageUrl: "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=800&q=80",
    acceptanceRate: 33,
    location: "Culver, IN",
    type: "Boarding",
    ranking: 39,
    websiteUrl: "https://www.culver.org"
  },
  "The Webb Schools": {
    name: "The Webb Schools",
    imageUrl: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=800&q=80",
    acceptanceRate: 31,
    location: "Claremont, CA",
    type: "Boarding/Day",
    ranking: 40,
    websiteUrl: "https://www.webb.org"
  },
  "Woodberry Forest School": {
    name: "Woodberry Forest School",
    imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80",
    acceptanceRate: 37,
    location: "Woodberry Forest, VA",
    type: "Boarding",
    ranking: 41,
    websiteUrl: "https://www.woodberry.org"
  },
  "Salisbury School": {
    name: "Salisbury School",
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80",
    acceptanceRate: 39,
    location: "Salisbury, CT",
    type: "Boarding",
    ranking: 42,
    websiteUrl: "https://www.salisburyschool.org"
  },
  "The Governor's Academy": {
    name: "The Governor's Academy",
    imageUrl: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80",
    acceptanceRate: 36,
    location: "Byfield, MA",
    type: "Boarding/Day",
    ranking: 43,
    websiteUrl: "https://www.thegovernorsacademy.org"
  },
  "Asheville School": {
    name: "Asheville School",
    imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80",
    acceptanceRate: 41,
    location: "Asheville, NC",
    type: "Boarding",
    ranking: 44,
    websiteUrl: "https://www.ashevilleschool.org"
  },
  "St. Andrew's School": {
    name: "St. Andrew's School",
    imageUrl: "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=800&q=80",
    acceptanceRate: 33,
    location: "Middletown, DE",
    type: "Boarding",
    ranking: 45,
    websiteUrl: "https://www.standrews-de.org"
  },
  "Portsmouth Abbey School": {
    name: "Portsmouth Abbey School",
    imageUrl: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=800&q=80",
    acceptanceRate: 42,
    location: "Portsmouth, RI",
    type: "Boarding",
    ranking: 46,
    websiteUrl: "https://www.portsmouthabbey.org"
  },
  "The Williston Northampton School": {
    name: "The Williston Northampton School",
    imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80",
    acceptanceRate: 44,
    location: "Easthampton, MA",
    type: "Boarding/Day",
    ranking: 47,
    websiteUrl: "https://www.williston.com"
  },
  "Gould Academy": {
    name: "Gould Academy",
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80",
    acceptanceRate: 45,
    location: "Bethel, ME",
    type: "Boarding",
    ranking: 48,
    websiteUrl: "https://www.gouldacademy.org"
  },
  "Kimball Union Academy": {
    name: "Kimball Union Academy",
    imageUrl: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80",
    acceptanceRate: 43,
    location: "Meriden, NH",
    type: "Boarding",
    ranking: 49,
    websiteUrl: "https://www.kua.org"
  },
  "Canterbury School": {
    name: "Canterbury School",
    imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80",
    acceptanceRate: 40,
    location: "New Milford, CT",
    type: "Boarding",
    ranking: 50,
    websiteUrl: "https://www.canterbury.org"
  },
  "Lake Forest Academy": {
    name: "Lake Forest Academy",
    imageUrl: "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=800&q=80",
    acceptanceRate: 46,
    location: "Lake Forest, IL",
    type: "Boarding/Day",
    ranking: 51,
    websiteUrl: "https://www.lfanet.org"
  },
  "St. George's School": {
    name: "St. George's School",
    imageUrl: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=800&q=80",
    acceptanceRate: 35,
    location: "Newport, RI",
    type: "Boarding",
    ranking: 52,
    websiteUrl: "https://www.stgeorges.edu"
  },
  "The Ethel Walker School": {
    name: "The Ethel Walker School",
    imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80",
    acceptanceRate: 48,
    location: "Simsbury, CT",
    type: "Boarding/Day",
    ranking: 53,
    websiteUrl: "https://www.ethelwalker.org"
  },
  "Indian Springs School": {
    name: "Indian Springs School",
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80",
    acceptanceRate: 42,
    location: "Indian Springs, AL",
    type: "Boarding/Day",
    ranking: 54,
    websiteUrl: "https://www.indiansprings.org"
  },
  "Oregon Episcopal School": {
    name: "Oregon Episcopal School",
    imageUrl: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80",
    acceptanceRate: 45,
    location: "Portland, OR",
    type: "Boarding/Day",
    ranking: 55,
    websiteUrl: "https://www.oes.edu"
  },
  "Stevenson School": {
    name: "Stevenson School",
    imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80",
    acceptanceRate: 40,
    location: "Pebble Beach, CA",
    type: "Boarding/Day",
    ranking: 56,
    websiteUrl: "https://www.stevensonschool.org"
  },
  "The Madeira School": {
    name: "The Madeira School",
    imageUrl: "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=800&q=80",
    acceptanceRate: 47,
    location: "McLean, VA",
    type: "Boarding/Day",
    ranking: 57,
    websiteUrl: "https://www.madeira.org"
  },
  "The Athenian School": {
    name: "The Athenian School",
    imageUrl: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=800&q=80",
    acceptanceRate: 44,
    location: "Danville, CA",
    type: "Boarding/Day",
    ranking: 58,
    websiteUrl: "https://www.athenian.org"
  },
  "Westover School": {
    name: "Westover School",
    imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80",
    acceptanceRate: 49,
    location: "Middlebury, CT",
    type: "Boarding",
    ranking: 59,
    websiteUrl: "https://www.westoverschool.org"
  },
  "Saint James School": {
    name: "Saint James School",
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80",
    acceptanceRate: 50,
    location: "Hagerstown, MD",
    type: "Boarding/Day",
    ranking: 60,
    websiteUrl: "https://www.stjames.edu"
  },
  "New Hampton School": {
    name: "New Hampton School",
    imageUrl: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80",
    acceptanceRate: 52,
    location: "New Hampton, NH",
    type: "Boarding",
    ranking: 61,
    websiteUrl: "https://www.newhampton.org"
  },
  "The Storm King School": {
    name: "The Storm King School",
    imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80",
    acceptanceRate: 55,
    location: "Cornwall-on-Hudson, NY",
    type: "Boarding",
    ranking: 62,
    websiteUrl: "https://www.sks.org"
  },
  "Millbrook School": {
    name: "Millbrook School",
    imageUrl: "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=800&q=80",
    acceptanceRate: 48,
    location: "Millbrook, NY",
    type: "Boarding",
    ranking: 63,
    websiteUrl: "https://www.millbrook.org"
  },
  "Vermont Academy": {
    name: "Vermont Academy",
    imageUrl: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=800&q=80",
    acceptanceRate: 58,
    location: "Saxtons River, VT",
    type: "Boarding/Day",
    ranking: 64,
    websiteUrl: "https://www.vermontacademy.org"
  },
  "The Pennington School": {
    name: "The Pennington School",
    imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80",
    acceptanceRate: 53,
    location: "Pennington, NJ",
    type: "Boarding/Day",
    ranking: 65,
    websiteUrl: "https://www.pennington.org"
  },
  "Proctor Academy": {
    name: "Proctor Academy",
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80",
    acceptanceRate: 60,
    location: "Andover, NH",
    type: "Boarding",
    ranking: 66,
    websiteUrl: "https://www.proctoracademy.org"
  },
  "Hebron Academy": {
    name: "Hebron Academy",
    imageUrl: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80",
    acceptanceRate: 62,
    location: "Hebron, ME",
    type: "Boarding",
    ranking: 67,
    websiteUrl: "https://www.hebronacademy.org"
  },
  "The White Mountain School": {
    name: "The White Mountain School",
    imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80",
    acceptanceRate: 64,
    location: "Bethlehem, NH",
    type: "Boarding",
    ranking: 68,
    websiteUrl: "https://www.whitemountain.org"
  },
  "Tilton School": {
    name: "Tilton School",
    imageUrl: "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=800&q=80",
    acceptanceRate: 56,
    location: "Tilton, NH",
    type: "Boarding/Day",
    ranking: 69,
    websiteUrl: "https://www.tiltonschool.org"
  },
  "Cushing Academy": {
    name: "Cushing Academy",
    imageUrl: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=800&q=80",
    acceptanceRate: 54,
    location: "Ashburnham, MA",
    type: "Boarding",
    ranking: 70,
    websiteUrl: "https://www.cushing.org"
  },
  "Trinity-Pawling School": {
    name: "Trinity-Pawling School",
    imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80",
    acceptanceRate: 57,
    location: "Pawling, NY",
    type: "Boarding",
    ranking: 71,
    websiteUrl: "https://www.trinitypawling.org"
  },
  "Avon Old Farms School": {
    name: "Avon Old Farms School",
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80",
    acceptanceRate: 51,
    location: "Avon, CT",
    type: "Boarding",
    ranking: 72,
    websiteUrl: "https://www.avonoldfarms.com"
  },
  "The Frederick Gunn School": {
    name: "The Frederick Gunn School",
    imageUrl: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80",
    acceptanceRate: 59,
    location: "Washington, CT",
    type: "Boarding/Day",
    ranking: 73,
    websiteUrl: "https://www.frederickgunn.org"
  },
  "Foxcroft School": {
    name: "Foxcroft School",
    imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80",
    acceptanceRate: 65,
    location: "Middleburg, VA",
    type: "Boarding/Day",
    ranking: 74,
    websiteUrl: "https://www.foxcroft.org"
  },
  "Chatham Hall": {
    name: "Chatham Hall",
    imageUrl: "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=800&q=80",
    acceptanceRate: 63,
    location: "Chatham, VA",
    type: "Boarding",
    ranking: 75,
    websiteUrl: "https://www.chathamhall.org"
  },
  "The Putney School": {
    name: "The Putney School",
    imageUrl: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=800&q=80",
    acceptanceRate: 61,
    location: "Putney, VT",
    type: "Boarding",
    ranking: 76,
    websiteUrl: "https://www.putneyschool.org"
  },
  "Dublin School": {
    name: "Dublin School",
    imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80",
    acceptanceRate: 66,
    location: "Dublin, NH",
    type: "Boarding",
    ranking: 77,
    websiteUrl: "https://www.dublinschool.org"
  },
  "Brewster Academy": {
    name: "Brewster Academy",
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80",
    acceptanceRate: 68,
    location: "Wolfeboro, NH",
    type: "Boarding",
    ranking: 78,
    websiteUrl: "https://www.brewsteracademy.org"
  },
  "The Cambridge School of Weston": {
    name: "The Cambridge School of Weston",
    imageUrl: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80",
    acceptanceRate: 70,
    location: "Weston, MA",
    type: "Day",
    ranking: 79,
    websiteUrl: "https://www.csw.org"
  },
  "Cheshire Academy": {
    name: "Cheshire Academy",
    imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80",
    acceptanceRate: 67,
    location: "Cheshire, CT",
    type: "Boarding/Day",
    ranking: 80,
    websiteUrl: "https://www.cheshireacademy.org"
  },
  "Darlington School": {
    name: "Darlington School",
    imageUrl: "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=800&q=80",
    acceptanceRate: 72,
    location: "Rome, GA",
    type: "Boarding/Day",
    ranking: 81,
    websiteUrl: "https://www.darlingtonschool.org"
  },
  "The Perkiomen School": {
    name: "The Perkiomen School",
    imageUrl: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=800&q=80",
    acceptanceRate: 69,
    location: "Pennsburg, PA",
    type: "Boarding/Day",
    ranking: 82,
    websiteUrl: "https://www.perkiomen.org"
  },
  "Fountain Valley School": {
    name: "Fountain Valley School",
    imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80",
    acceptanceRate: 71,
    location: "Colorado Springs, CO",
    type: "Boarding",
    ranking: 83,
    websiteUrl: "https://www.fvs.edu"
  },
  "Idyllwild Arts Academy": {
    name: "Idyllwild Arts Academy",
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80",
    acceptanceRate: 74,
    location: "Idyllwild, CA",
    type: "Boarding",
    ranking: 84,
    websiteUrl: "https://www.idyllwildarts.org"
  },
  "The Knox School": {
    name: "The Knox School",
    imageUrl: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80",
    acceptanceRate: 75,
    location: "St. James, NY",
    type: "Boarding/Day",
    ranking: 85,
    websiteUrl: "https://www.knoxschool.org"
  },
  "Wyoming Seminary": {
    name: "Wyoming Seminary",
    imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80",
    acceptanceRate: 73,
    location: "Kingston, PA",
    type: "Boarding/Day",
    ranking: 86,
    websiteUrl: "https://www.wyomingseminary.org"
  },
  "Saint Andrew's School": {
    name: "Saint Andrew's School",
    imageUrl: "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=800&q=80",
    acceptanceRate: 76,
    location: "Boca Raton, FL",
    type: "Boarding/Day",
    ranking: 87,
    websiteUrl: "https://www.saintandrews.net"
  },
  "The Bolles School": {
    name: "The Bolles School",
    imageUrl: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=800&q=80",
    acceptanceRate: 78,
    location: "Jacksonville, FL",
    type: "Boarding/Day",
    ranking: 88,
    websiteUrl: "https://www.bolles.org"
  },
  "McCallie School": {
    name: "McCallie School",
    imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80",
    acceptanceRate: 77,
    location: "Chattanooga, TN",
    type: "Boarding/Day",
    ranking: 89,
    websiteUrl: "https://www.mccallie.org"
  },
  "Baylor School": {
    name: "Baylor School",
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80",
    acceptanceRate: 79,
    location: "Chattanooga, TN",
    type: "Boarding/Day",
    ranking: 90,
    websiteUrl: "https://www.baylorschool.org"
  },
  "The Webb School": {
    name: "The Webb School",
    imageUrl: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80",
    acceptanceRate: 80,
    location: "Bell Buckle, TN",
    type: "Boarding/Day",
    ranking: 91,
    websiteUrl: "https://www.thewebbschool.com"
  },
  "Virginia Episcopal School": {
    name: "Virginia Episcopal School",
    imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80",
    acceptanceRate: 81,
    location: "Lynchburg, VA",
    type: "Boarding/Day",
    ranking: 92,
    websiteUrl: "https://www.ves.org"
  },
  "Fork Union Military Academy": {
    name: "Fork Union Military Academy",
    imageUrl: "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=800&q=80",
    acceptanceRate: 82,
    location: "Fork Union, VA",
    type: "Boarding",
    ranking: 93,
    websiteUrl: "https://www.forkunion.com"
  },
  "Stuart Hall School": {
    name: "Stuart Hall School",
    imageUrl: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=800&q=80",
    acceptanceRate: 83,
    location: "Staunton, VA",
    type: "Boarding/Day",
    ranking: 94,
    websiteUrl: "https://www.stuarthallschool.org"
  },
  "The Miller School of Albemarle": {
    name: "The Miller School of Albemarle",
    imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80",
    acceptanceRate: 84,
    location: "Charlottesville, VA",
    type: "Boarding/Day",
    ranking: 95,
    websiteUrl: "https://www.millerschoolofalbemarle.org"
  },
  "Christchurch School": {
    name: "Christchurch School",
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80",
    acceptanceRate: 85,
    location: "Christchurch, VA",
    type: "Boarding/Day",
    ranking: 96,
    websiteUrl: "https://www.christchurchschool.org"
  },
  "Randolph-Macon Academy": {
    name: "Randolph-Macon Academy",
    imageUrl: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80",
    acceptanceRate: 86,
    location: "Front Royal, VA",
    type: "Boarding/Day",
    ranking: 97,
    websiteUrl: "https://www.rma.edu"
  },
  "Massanutten Military Academy": {
    name: "Massanutten Military Academy",
    imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80",
    acceptanceRate: 87,
    location: "Woodstock, VA",
    type: "Boarding",
    ranking: 98,
    websiteUrl: "https://www.militaryschool.com"
  },
  "The Orme School": {
    name: "The Orme School",
    imageUrl: "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=800&q=80",
    acceptanceRate: 88,
    location: "Mayer, AZ",
    type: "Boarding",
    ranking: 99,
    websiteUrl: "https://www.ormeschool.org"
  },
  "Wasatch Academy": {
    name: "Wasatch Academy",
    imageUrl: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=800&q=80",
    acceptanceRate: 89,
    location: "Mt. Pleasant, UT",
    type: "Boarding",
    ranking: 100,
    websiteUrl: "https://www.wasatchacademy.org"
  },
  "Rabun Gap-Nacoochee School": {
    name: "Rabun Gap-Nacoochee School",
    imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80",
    acceptanceRate: 45,
    location: "Rabun Gap, GA",
    type: "Boarding/Day",
    ranking: 101,
    websiteUrl: "https://www.rabungap.org"
  },
  "Tallulah Falls School": {
    name: "Tallulah Falls School",
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80",
    acceptanceRate: 50,
    location: "Tallulah Falls, GA",
    type: "Boarding/Day",
    ranking: 102,
    websiteUrl: "https://www.tallulahfalls.org"
  },
  "Riverside Military Academy": {
    name: "Riverside Military Academy",
    imageUrl: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80",
    acceptanceRate: 65,
    location: "Gainesville, GA",
    type: "Boarding",
    ranking: 103,
    websiteUrl: "https://www.riversidemilitary.org"
  },
  "Brandon Hall School": {
    name: "Brandon Hall School",
    imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80",
    acceptanceRate: 70,
    location: "Atlanta, GA",
    type: "Boarding/Day",
    ranking: 104,
    websiteUrl: "https://www.brandonhall.org"
  },
  "Admiral Farragut Academy": {
    name: "Admiral Farragut Academy",
    imageUrl: "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=800&q=80",
    acceptanceRate: 75,
    location: "St. Petersburg, FL",
    type: "Boarding/Day",
    ranking: 105,
    websiteUrl: "https://www.farragut.org"
  },
  "IMG Academy": {
    name: "IMG Academy",
    imageUrl: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=800&q=80",
    acceptanceRate: 40,
    location: "Bradenton, FL",
    type: "Boarding",
    ranking: 106,
    websiteUrl: "https://www.imgacademy.com"
  },
  "Montverde Academy": {
    name: "Montverde Academy",
    imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80",
    acceptanceRate: 55,
    location: "Montverde, FL",
    type: "Boarding/Day",
    ranking: 107,
    websiteUrl: "https://www.montverde.org"
  },
  "The Benjamin School": {
    name: "The Benjamin School",
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80",
    acceptanceRate: 48,
    location: "Palm Beach Gardens, FL",
    type: "Day",
    ranking: 108,
    websiteUrl: "https://www.thebenjaminschool.org"
  },
  "Pine Crest School": {
    name: "Pine Crest School",
    imageUrl: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80",
    acceptanceRate: 42,
    location: "Fort Lauderdale, FL",
    type: "Day",
    ranking: 109,
    websiteUrl: "https://www.pinecrest.edu"
  },
  "Ransom Everglades School": {
    name: "Ransom Everglades School",
    imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80",
    acceptanceRate: 38,
    location: "Coconut Grove, FL",
    type: "Day",
    ranking: 110,
    websiteUrl: "https://www.ransomeverglades.org"
  },
  "Gulliver Preparatory School": {
    name: "Gulliver Preparatory School",
    imageUrl: "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=800&q=80",
    acceptanceRate: 46,
    location: "Miami, FL",
    type: "Day",
    ranking: 111,
    websiteUrl: "https://www.gulliverschools.org"
  },
  "Miami Country Day School": {
    name: "Miami Country Day School",
    imageUrl: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=800&q=80",
    acceptanceRate: 52,
    location: "Miami, FL",
    type: "Day",
    ranking: 112,
    websiteUrl: "https://www.miamicountryday.org"
  },
  "American Heritage School": {
    name: "American Heritage School",
    imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80",
    acceptanceRate: 60,
    location: "Plantation, FL",
    type: "Day",
    ranking: 113,
    websiteUrl: "https://www.ahschool.com"
  },
  "NSU University School": {
    name: "NSU University School",
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80",
    acceptanceRate: 58,
    location: "Davie, FL",
    type: "Day",
    ranking: 114,
    websiteUrl: "https://www.uschool.nova.edu"
  },
  "Palmer Trinity School": {
    name: "Palmer Trinity School",
    imageUrl: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80",
    acceptanceRate: 54,
    location: "Palmetto Bay, FL",
    type: "Day",
    ranking: 115,
    websiteUrl: "https://www.palmertrinity.org"
  },
  "The Out-of-Door Academy": {
    name: "The Out-of-Door Academy",
    imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80",
    acceptanceRate: 62,
    location: "Sarasota, FL",
    type: "Day",
    ranking: 116,
    websiteUrl: "https://www.oda.edu"
  },
  "Berkeley Preparatory School": {
    name: "Berkeley Preparatory School",
    imageUrl: "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=800&q=80",
    acceptanceRate: 44,
    location: "Tampa, FL",
    type: "Day",
    ranking: 117,
    websiteUrl: "https://www.berkeleyprep.org"
  },
  "Tampa Preparatory School": {
    name: "Tampa Preparatory School",
    imageUrl: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=800&q=80",
    acceptanceRate: 56,
    location: "Tampa, FL",
    type: "Day",
    ranking: 118,
    websiteUrl: "https://www.tampaprep.org"
  },
  "Shorecrest Preparatory School": {
    name: "Shorecrest Preparatory School",
    imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80",
    acceptanceRate: 64,
    location: "St. Petersburg, FL",
    type: "Day",
    ranking: 119,
    websiteUrl: "https://www.shorecrest.org"
  },
  "Saint Stephen's Episcopal School": {
    name: "Saint Stephen's Episcopal School",
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80",
    acceptanceRate: 68,
    location: "Bradenton, FL",
    type: "Day",
    ranking: 120,
    websiteUrl: "https://www.saintstephens.org"
  },
  "Cardinal Mooney Catholic High School": {
    name: "Cardinal Mooney Catholic High School",
    imageUrl: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80",
    acceptanceRate: 72,
    location: "Sarasota, FL",
    type: "Day",
    ranking: 121,
    websiteUrl: "https://www.cmhs-sarasota.org"
  },
  "Bishop Verot Catholic High School": {
    name: "Bishop Verot Catholic High School",
    imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80",
    acceptanceRate: 74,
    location: "Fort Myers, FL",
    type: "Day",
    ranking: 122,
    websiteUrl: "https://www.bishopverot.org"
  },
  "Canterbury School of Florida": {
    name: "Canterbury School of Florida",
    imageUrl: "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=800&q=80",
    acceptanceRate: 66,
    location: "St. Petersburg, FL",
    type: "Day",
    ranking: 123,
    websiteUrl: "https://www.canterburyflorida.org"
  },
  "Windermere Preparatory School": {
    name: "Windermere Preparatory School",
    imageUrl: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=800&q=80",
    acceptanceRate: 50,
    location: "Windermere, FL",
    type: "Boarding/Day",
    ranking: 124,
    websiteUrl: "https://www.windermereprep.com"
  },
  "Lake Highland Preparatory School": {
    name: "Lake Highland Preparatory School",
    imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80",
    acceptanceRate: 58,
    location: "Orlando, FL",
    type: "Day",
    ranking: 125,
    websiteUrl: "https://www.lakehighland.org"
  },
  "Trinity Preparatory School": {
    name: "Trinity Preparatory School",
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80",
    acceptanceRate: 48,
    location: "Winter Park, FL",
    type: "Day",
    ranking: 126,
    websiteUrl: "https://www.trinityprep.org"
  },
  "The Geneva School": {
    name: "The Geneva School",
    imageUrl: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80",
    acceptanceRate: 62,
    location: "Winter Park, FL",
    type: "Day",
    ranking: 127,
    websiteUrl: "https://www.genevaschool.org"
  },
  "The First Academy": {
    name: "The First Academy",
    imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80",
    acceptanceRate: 70,
    location: "Orlando, FL",
    type: "Day",
    ranking: 128,
    websiteUrl: "https://www.thefirstacademy.org"
  },
  "Foundation Academy": {
    name: "Foundation Academy",
    imageUrl: "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=800&q=80",
    acceptanceRate: 76,
    location: "Winter Garden, FL",
    type: "Day",
    ranking: 129,
    websiteUrl: "https://www.foundationacademy.org"
  },
  "Mount Dora Christian Academy": {
    name: "Mount Dora Christian Academy",
    imageUrl: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=800&q=80",
    acceptanceRate: 80,
    location: "Mount Dora, FL",
    type: "Boarding/Day",
    ranking: 130,
    websiteUrl: "https://www.mdca.org"
  },
  "Orangewood Christian School": {
    name: "Orangewood Christian School",
    imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80",
    acceptanceRate: 78,
    location: "Maitland, FL",
    type: "Day",
    ranking: 131,
    websiteUrl: "https://www.orangewood.org"
  },
  "Bishop Moore Catholic High School": {
    name: "Bishop Moore Catholic High School",
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80",
    acceptanceRate: 65,
    location: "Orlando, FL",
    type: "Day",
    ranking: 132,
    websiteUrl: "https://www.bishopmoore.org"
  },
  "Father Lopez Catholic High School": {
    name: "Father Lopez Catholic High School",
    imageUrl: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80",
    acceptanceRate: 82,
    location: "Daytona Beach, FL",
    type: "Day",
    ranking: 133,
    websiteUrl: "https://www.fatherlopez.org"
  },
  "Seabreeze High School": {
    name: "Seabreeze High School",
    imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80",
    acceptanceRate: 85,
    location: "Daytona Beach, FL",
    type: "Day",
    ranking: 134,
    websiteUrl: "https://www.seabreezehigh.org"
  },
  "Spruce Creek High School": {
    name: "Spruce Creek High School",
    imageUrl: "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=800&q=80",
    acceptanceRate: 88,
    location: "Port Orange, FL",
    type: "Day",
    ranking: 135,
    websiteUrl: "https://www.sprucecreekhigh.org"
  },
  "New Smyrna Beach High School": {
    name: "New Smyrna Beach High School",
    imageUrl: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=800&q=80",
    acceptanceRate: 90,
    location: "New Smyrna Beach, FL",
    type: "Day",
    ranking: 136,
    websiteUrl: "https://www.nsbhigh.org"
  },
  "The Vanguard School": {
    name: "The Vanguard School",
    imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80",
    acceptanceRate: 60,
    location: "Lake Wales, FL",
    type: "Boarding/Day",
    ranking: 137,
    websiteUrl: "https://www.vanguardschool.org"
  },
  "North Broward Preparatory School": {
    name: "North Broward Preparatory School",
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80",
    acceptanceRate: 45,
    location: "Coconut Creek, FL",
    type: "Boarding/Day",
    ranking: 138,
    websiteUrl: "https://www.nbps.org"
  },
  "Saint John Paul II Academy": {
    name: "Saint John Paul II Academy",
    imageUrl: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80",
    acceptanceRate: 55,
    location: "Boca Raton, FL",
    type: "Day",
    ranking: 139,
    websiteUrl: "https://www.sjpii.net"
  },
  "Westminster Academy": {
    name: "Westminster Academy",
    imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80",
    acceptanceRate: 67,
    location: "Fort Lauderdale, FL",
    type: "Day",
    ranking: 140,
    websiteUrl: "https://www.wa.edu"
  },
  "Calvary Christian Academy": {
    name: "Calvary Christian Academy",
    imageUrl: "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=800&q=80",
    acceptanceRate: 73,
    location: "Fort Lauderdale, FL",
    type: "Day",
    ranking: 141,
    websiteUrl: "https://www.ccaeagles.org"
  },
  "Somerset Academy": {
    name: "Somerset Academy",
    imageUrl: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=800&q=80",
    acceptanceRate: 79,
    location: "Pembroke Pines, FL",
    type: "Day",
    ranking: 142,
    websiteUrl: "https://www.somersetacademy.com"
  },
  "Coral Springs Charter School": {
    name: "Coral Springs Charter School",
    imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80",
    acceptanceRate: 40,
    location: "Coral Springs, FL",
    type: "Day",
    ranking: 143,
    websiteUrl: "https://www.coralspringscharter.org"
  },
  "Boca Raton Christian School": {
    name: "Boca Raton Christian School",
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80",
    acceptanceRate: 68,
    location: "Boca Raton, FL",
    type: "Day",
    ranking: 144,
    websiteUrl: "https://www.brcs.org"
  },
  "Spanish River Community High School": {
    name: "Spanish River Community High School",
    imageUrl: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80",
    acceptanceRate: 45,
    location: "Boca Raton, FL",
    type: "Day",
    ranking: 145,
    websiteUrl: "https://www.spanishriverhigh.org"
  },
  "West Boca Raton High School": {
    name: "West Boca Raton High School",
    imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80",
    acceptanceRate: 50,
    location: "Boca Raton, FL",
    type: "Day",
    ranking: 146,
    websiteUrl: "https://www.westbocaratonhigh.org"
  },
  "Olympic Heights Community High School": {
    name: "Olympic Heights Community High School",
    imageUrl: "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=800&q=80",
    acceptanceRate: 52,
    location: "Boca Raton, FL",
    type: "Day",
    ranking: 147,
    websiteUrl: "https://www.olympicheightshigh.org"
  },
  "Boca Raton Community High School": {
    name: "Boca Raton Community High School",
    imageUrl: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=800&q=80",
    acceptanceRate: 55,
    location: "Boca Raton, FL",
    type: "Day",
    ranking: 148,
    websiteUrl: "https://www.bocaratonhigh.org"
  },
  "Atlantic Community High School": {
    name: "Atlantic Community High School",
    imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80",
    acceptanceRate: 58,
    location: "Delray Beach, FL",
    type: "Day",
    ranking: 149,
    websiteUrl: "https://www.atlantichigh.org"
  },
  "Wellington High School": {
    name: "Wellington High School",
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80",
    acceptanceRate: 48,
    location: "Wellington, FL",
    type: "Day",
    ranking: 150,
    websiteUrl: "https://www.wellingtonhigh.org"
  },
  "Seminole Ridge Community High School": {
    name: "Seminole Ridge Community High School",
    imageUrl: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80",
    acceptanceRate: 54,
    location: "Loxahatchee, FL",
    type: "Day",
    ranking: 151,
    websiteUrl: "https://www.seminoleridgehigh.org"
  },
  "Royal Palm Beach High School": {
    name: "Royal Palm Beach High School",
    imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80",
    acceptanceRate: 57,
    location: "Royal Palm Beach, FL",
    type: "Day",
    ranking: 152,
    websiteUrl: "https://www.royalpalmbeachhigh.org"
  },
  "Jupiter High School": {
    name: "Jupiter High School",
    imageUrl: "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=800&q=80",
    acceptanceRate: 46,
    location: "Jupiter, FL",
    type: "Day",
    ranking: 153,
    websiteUrl: "https://www.jupiterhigh.org"
  },
  "Palm Beach Gardens High School": {
    name: "Palm Beach Gardens High School",
    imageUrl: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=800&q=80",
    acceptanceRate: 49,
    location: "Palm Beach Gardens, FL",
    type: "Day",
    ranking: 154,
    websiteUrl: "https://www.palmbeachgardens.org"
  },
  "Suncoast Community High School": {
    name: "Suncoast Community High School",
    imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80",
    acceptanceRate: 25,
    location: "Riviera Beach, FL",
    type: "Day",
    ranking: 155,
    websiteUrl: "https://www.suncoasthigh.org"
  },
  "Dreyfoos School of the Arts": {
    name: "Dreyfoos School of the Arts",
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80",
    acceptanceRate: 28,
    location: "West Palm Beach, FL",
    type: "Day",
    ranking: 156,
    websiteUrl: "https://www.dreyfoos.org"
  },
  "Forest Hill Community High School": {
    name: "Forest Hill Community High School",
    imageUrl: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80",
    acceptanceRate: 60,
    location: "West Palm Beach, FL",
    type: "Day",
    ranking: 157,
    websiteUrl: "https://www.foresthillhigh.org"
  },
  "Palm Beach Central High School": {
    name: "Palm Beach Central High School",
    imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80",
    acceptanceRate: 53,
    location: "Wellington, FL",
    type: "Day",
    ranking: 158,
    websiteUrl: "https://www.palmbeachcentral.org"
  },
  "Park Vista Community High School": {
    name: "Park Vista Community High School",
    imageUrl: "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=800&q=80",
    acceptanceRate: 51,
    location: "Lake Worth, FL",
    type: "Day",
    ranking: 159,
    websiteUrl: "https://www.parkvistahigh.org"
  },
  "John I. Leonard High School": {
    name: "John I. Leonard High School",
    imageUrl: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=800&q=80",
    acceptanceRate: 63,
    location: "Greenacres, FL",
    type: "Day",
    ranking: 160,
    websiteUrl: "https://www.johnileonardhigh.org"
  },
  "Lake Worth Community High School": {
    name: "Lake Worth Community High School",
    imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80",
    acceptanceRate: 65,
    location: "Lake Worth, FL",
    type: "Day",
    ranking: 161,
    websiteUrl: "https://www.lakeworthhigh.org"
  },
  "Boynton Beach Community High School": {
    name: "Boynton Beach Community High School",
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80",
    acceptanceRate: 61,
    location: "Boynton Beach, FL",
    type: "Day",
    ranking: 162,
    websiteUrl: "https://www.boyntonbeachhigh.org"
  },
  "Santaluces Community High School": {
    name: "Santaluces Community High School",
    imageUrl: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80",
    acceptanceRate: 59,
    location: "Lantana, FL",
    type: "Day",
    ranking: 163,
    websiteUrl: "https://www.santaluceshigh.org"
  },
  "Palm Beach Lakes Community High School": {
    name: "Palm Beach Lakes Community High School",
    imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80",
    acceptanceRate: 62,
    location: "West Palm Beach, FL",
    type: "Day",
    ranking: 164,
    websiteUrl: "https://www.palmbeachlakeshigh.org"
  },
  "Pahokee High School": {
    name: "Pahokee High School",
    imageUrl: "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=800&q=80",
    acceptanceRate: 75,
    location: "Pahokee, FL",
    type: "Day",
    ranking: 165,
    websiteUrl: "https://www.pahokeehigh.org"
  },
  "Glades Central High School": {
    name: "Glades Central High School",
    imageUrl: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=800&q=80",
    acceptanceRate: 78,
    location: "Belle Glade, FL",
    type: "Day",
    ranking: 166,
    websiteUrl: "https://www.gladescentralhigh.org"
  },
  "Riviera Beach Maritime Academy": {
    name: "Riviera Beach Maritime Academy",
    imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80",
    acceptanceRate: 43,
    location: "Riviera Beach, FL",
    type: "Day",
    ranking: 167,
    websiteUrl: "https://www.rbmaritime.org"
  },
  "William T. Dwyer High School": {
    name: "William T. Dwyer High School",
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80",
    acceptanceRate: 47,
    location: "Palm Beach Gardens, FL",
    type: "Day",
    ranking: 168,
    websiteUrl: "https://www.dwyerhigh.org"
  },
  "G-Star School of the Arts": {
    name: "G-Star School of the Arts",
    imageUrl: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80",
    acceptanceRate: 35,
    location: "West Palm Beach, FL",
    type: "Day",
    ranking: 169,
    websiteUrl: "https://www.gstarschool.org"
  },
  "Palm Beach County School of the Arts": {
    name: "Palm Beach County School of the Arts",
    imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80",
    acceptanceRate: 38,
    location: "West Palm Beach, FL",
    type: "Day",
    ranking: 170,
    websiteUrl: "https://www.soafi.org"
  },
  "The King's Academy": {
    name: "The King's Academy",
    imageUrl: "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=800&q=80",
    acceptanceRate: 52,
    location: "West Palm Beach, FL",
    type: "Day",
    ranking: 171,
    websiteUrl: "https://www.tka.net"
  },
  "Cardinal Newman High School": {
    name: "Cardinal Newman High School",
    imageUrl: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=800&q=80",
    acceptanceRate: 56,
    location: "West Palm Beach, FL",
    type: "Day",
    ranking: 172,
    websiteUrl: "https://www.cardinalnewman.com"
  },
  "Pine Crest School": {
    name: "Pine Crest School",
    imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80",
    acceptanceRate: 41,
    location: "Fort Lauderdale, FL",
    type: "Day",
    ranking: 173,
    websiteUrl: "https://www.pinecrest.edu"
  },
  "Jupiter Christian School": {
    name: "Jupiter Christian School",
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80",
    acceptanceRate: 64,
    location: "Jupiter, FL",
    type: "Day",
    ranking: 174,
    websiteUrl: "https://www.jupiterchristian.org"
  },
  "Palm Beach Day Academy": {
    name: "Palm Beach Day Academy",
    imageUrl: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80",
    acceptanceRate: 36,
    location: "West Palm Beach, FL",
    type: "Day",
    ranking: 175,
    websiteUrl: "https://www.pbday.org"
  },
  "Gulf Stream School": {
    name: "Gulf Stream School",
    imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80",
    acceptanceRate: 39,
    location: "Gulf Stream, FL",
    type: "Day",
    ranking: 176,
    websiteUrl: "https://www.gulfstreamschool.org"
  },
  "Atlantic Christian Academy": {
    name: "Atlantic Christian Academy",
    imageUrl: "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=800&q=80",
    acceptanceRate: 69,
    location: "Egg Harbor Township, NJ",
    type: "Day",
    ranking: 177,
    websiteUrl: "https://www.atlanticchristian.org"
  },
  "Berean Christian School": {
    name: "Berean Christian School",
    imageUrl: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=800&q=80",
    acceptanceRate: 71,
    location: "West Palm Beach, FL",
    type: "Day",
    ranking: 178,
    websiteUrl: "https://www.bereanchristianschool.org"
  },
  "Grandview Preparatory School": {
    name: "Grandview Preparatory School",
    imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80",
    acceptanceRate: 42,
    location: "Boca Raton, FL",
    type: "Day",
    ranking: 179,
    websiteUrl: "https://www.grandviewprep.org"
  },
  "Highlands Christian Academy": {
    name: "Highlands Christian Academy",
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80",
    acceptanceRate: 66,
    location: "Pompano Beach, FL",
    type: "Day",
    ranking: 180,
    websiteUrl: "https://www.hcafl.org"
  },
  "Coral Springs Christian Academy": {
    name: "Coral Springs Christian Academy",
    imageUrl: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80",
    acceptanceRate: 63,
    location: "Coral Springs, FL",
    type: "Day",
    ranking: 181,
    websiteUrl: "https://www.csca.us"
  },
  "Westminster Christian School": {
    name: "Westminster Christian School",
    imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80",
    acceptanceRate: 45,
    location: "Miami, FL",
    type: "Day",
    ranking: 182,
    websiteUrl: "https://www.wcsmiami.org"
  },
  "Carrollton School of the Sacred Heart": {
    name: "Carrollton School of the Sacred Heart",
    imageUrl: "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=800&q=80",
    acceptanceRate: 40,
    location: "Miami, FL",
    type: "Day",
    ranking: 183,
    websiteUrl: "https://www.carrollton.org"
  },
  "Belen Jesuit Preparatory School": {
    name: "Belen Jesuit Preparatory School",
    imageUrl: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=800&q=80",
    acceptanceRate: 37,
    location: "Miami, FL",
    type: "Day",
    ranking: 184,
    websiteUrl: "https://www.belenjesuit.org"
  },
  "Christopher Columbus High School": {
    name: "Christopher Columbus High School",
    imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80",
    acceptanceRate: 43,
    location: "Miami, FL",
    type: "Day",
    ranking: 185,
    websiteUrl: "https://www.columbushs.com"
  },
  "Immaculata-La Salle High School": {
    name: "Immaculata-La Salle High School",
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80",
    acceptanceRate: 51,
    location: "Miami, FL",
    type: "Day",
    ranking: 186,
    websiteUrl: "https://www.immaculatalasalle.org"
  },
  "Monsignor Edward Pace High School": {
    name: "Monsignor Edward Pace High School",
    imageUrl: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80",
    acceptanceRate: 59,
    location: "Miami Gardens, FL",
    type: "Day",
    ranking: 187,
    websiteUrl: "https://www.pacehs.com"
  },
  "Our Lady of Lourdes Academy": {
    name: "Our Lady of Lourdes Academy",
    imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80",
    acceptanceRate: 48,
    location: "Miami, FL",
    type: "Day",
    ranking: 188,
    websiteUrl: "https://www.olla.org"
  },
  "St. Brendan High School": {
    name: "St. Brendan High School",
    imageUrl: "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=800&q=80",
    acceptanceRate: 61,
    location: "Miami, FL",
    type: "Day",
    ranking: 189,
    websiteUrl: "https://www.stbrendanhigh.org"
  },
  "Archbishop Coleman F. Carroll High School": {
    name: "Archbishop Coleman F. Carroll High School",
    imageUrl: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=800&q=80",
    acceptanceRate: 67,
    location: "Miami, FL",
    type: "Day",
    ranking: 190,
    websiteUrl: "https://www.colemancarroll.org"
  },
  "MAST Academy": {
    name: "MAST Academy",
    imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80",
    acceptanceRate: 30,
    location: "Key Biscayne, FL",
    type: "Day",
    ranking: 191,
    websiteUrl: "https://www.mastacademy.org"
  },
  "TERRA Environmental Research Institute": {
    name: "TERRA Environmental Research Institute",
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80",
    acceptanceRate: 32,
    location: "Miami, FL",
    type: "Day",
    ranking: 192,
    websiteUrl: "https://www.terra.edu"
  },
  "Design and Architecture Senior High": {
    name: "Design and Architecture Senior High",
    imageUrl: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80",
    acceptanceRate: 28,
    location: "Miami, FL",
    type: "Day",
    ranking: 193,
    websiteUrl: "https://www.dashschool.org"
  },
  "New World School of the Arts": {
    name: "New World School of the Arts",
    imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80",
    acceptanceRate: 26,
    location: "Miami, FL",
    type: "Day",
    ranking: 194,
    websiteUrl: "https://www.nwsa.edu"
  },
  "Coral Reef Senior High School": {
    name: "Coral Reef Senior High School",
    imageUrl: "https://images.unsplash.com/photo-1607237138185-eedd9c632b0b?w=800&q=80",
    acceptanceRate: 35,
    location: "Miami, FL",
    type: "Day",
    ranking: 195,
    websiteUrl: "https://www.coralreefhigh.org"
  },
  "Coral Gables Senior High School": {
    name: "Coral Gables Senior High School",
    imageUrl: "https://images.unsplash.com/photo-1592280771190-3e2e4d571952?w=800&q=80",
    acceptanceRate: 44,
    location: "Coral Gables, FL",
    type: "Day",
    ranking: 196,
    websiteUrl: "https://www.coralgableshigh.org"
  },
  "Miami Palmetto Senior High School": {
    name: "Miami Palmetto Senior High School",
    imageUrl: "https://images.unsplash.com/photo-1509062522246-3755977927d7?w=800&q=80",
    acceptanceRate: 41,
    location: "Pinecrest, FL",
    type: "Day",
    ranking: 197,
    websiteUrl: "https://www.palmettohigh.org"
  },
  "South Miami Senior High School": {
    name: "South Miami Senior High School",
    imageUrl: "https://images.unsplash.com/photo-1541339907198-e08756dedf3f?w=800&q=80",
    acceptanceRate: 53,
    location: "Miami, FL",
    type: "Day",
    ranking: 198,
    websiteUrl: "https://www.southmiamihigh.org"
  },
  "Miami Beach Senior High School": {
    name: "Miami Beach Senior High School",
    imageUrl: "https://images.unsplash.com/photo-1580582932707-520aed937b7b?w=800&q=80",
    acceptanceRate: 56,
    location: "Miami Beach, FL",
    type: "Day",
    ranking: 199,
    websiteUrl: "https://www.miamibeachhigh.org"
  },
  "Key West High School": {
    name: "Key West High School",
    imageUrl: "https://images.unsplash.com/photo-1562774053-701939374585?w=800&q=80",
    acceptanceRate: 60,
    location: "Key West, FL",
    type: "Day",
    ranking: 200,
    websiteUrl: "https://www.keywesthigh.org"
  }
}

// Helper function to escape regex special characters
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
}

export function parseSchoolRecommendations(aiResponse: string): ParsedSchool[] {
  const schools: ParsedSchool[] = []
  const foundSchoolNames = new Set<string>()
  
  // Create a list of all school names from our database for exact matching
  const allSchoolNames = Object.keys(SCHOOL_DATA)
  
  // Sort school names by length (longest first) to match longer names before shorter ones
  // This prevents "Exeter" from matching before "Phillips Exeter Academy"
  const sortedSchoolNames = allSchoolNames.sort((a, b) => b.length - a.length)
  
  // Convert AI response to lowercase for case-insensitive matching
  const lowerResponse = aiResponse.toLowerCase()
  
  // Search for each school name in the AI response
  for (const schoolName of sortedSchoolNames) {
    const lowerSchoolName = schoolName.toLowerCase()
    
    // Check if the school name appears in the AI response
    if (lowerResponse.includes(lowerSchoolName)) {
      // Verify it's a word boundary match to avoid partial matches
      const regex = new RegExp(`\\b${escapeRegex(lowerSchoolName)}\\b`, 'gi')
      if (regex.test(aiResponse)) {
        foundSchoolNames.add(schoolName)
      }
    }
  }
  
  // Also check for schools in specific patterns (bold, lists, etc.)
  // Pattern 1: **School Name** or **🏫 School Name**
  const boldPattern = /\*\*(?:🏫\s*)?([^*]+)\*\*/g
  let match
  while ((match = boldPattern.exec(aiResponse)) !== null) {
    const extractedName = match[1].trim()
    // Check if this extracted name matches any school in our database
    for (const schoolName of allSchoolNames) {
      if (extractedName.toLowerCase() === schoolName.toLowerCase() || 
          schoolName.toLowerCase().includes(extractedName.toLowerCase()) ||
          extractedName.toLowerCase().includes(schoolName.toLowerCase())) {
        foundSchoolNames.add(schoolName)
      }
    }
  }
  
  // Pattern 2: Numbered lists (1. School Name, 2. School Name, etc.)
  const numberedPattern = /\d+\.\s*([^:,\n]+?)(?:\s*[-–—:]|\s*,|\s*\n|$)/gm
  while ((match = numberedPattern.exec(aiResponse)) !== null) {
    const extractedName = match[1].trim()
    // Check if this extracted name matches any school in our database
    for (const schoolName of allSchoolNames) {
      if (extractedName.toLowerCase() === schoolName.toLowerCase() || 
          schoolName.toLowerCase().includes(extractedName.toLowerCase()) ||
          extractedName.toLowerCase().includes(schoolName.toLowerCase())) {
        foundSchoolNames.add(schoolName)
      }
    }
  }
  
  // Pattern 3: Bullet points (• School Name or - School Name)
  const bulletPattern = /(?:•|-)\s*([^:,\n]+?)(?:\s*[-–—:]|\s*,|\s*\n|$)/gm
  while ((match = bulletPattern.exec(aiResponse)) !== null) {
    const extractedName = match[1].trim()
    // Check if this extracted name matches any school in our database
    for (const schoolName of allSchoolNames) {
      if (extractedName.toLowerCase() === schoolName.toLowerCase() || 
          schoolName.toLowerCase().includes(extractedName.toLowerCase()) ||
          extractedName.toLowerCase().includes(schoolName.toLowerCase())) {
        foundSchoolNames.add(schoolName)
      }
    }
  }
  
  // Convert found school names to ParsedSchool objects
  for (const schoolName of foundSchoolNames) {
    if (SCHOOL_DATA[schoolName]) {
      schools.push({
        id: schoolName.toLowerCase().replace(/\s+/g, '-'),
        ...SCHOOL_DATA[schoolName]
      })
    }
  }
  
  // Return only the first 3 schools found (or all if less than 3)
  return schools.slice(0, 3)
}

// Note: The isLikelySchoolName and fuzzyMatch functions are no longer needed
// with the new exact matching approach