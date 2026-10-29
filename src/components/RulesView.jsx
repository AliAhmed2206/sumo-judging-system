import React, { useState } from 'react';
import { 
  BookOpen, 
  ShieldCheck, 
  AlertTriangle, 
  CheckCircle2, 
  Scale, 
  Clock, 
  Wine,
  Printer,
  ChevronRight,
  Mail,
  Phone,
  User,
  Ban,
  Check
} from 'lucide-react';
import { TOURNAMENT_METADATA } from '../data/initialData';

export default function RulesView() {
  const [activeSection, setActiveSection] = useState('ALL');

  const handbookSections = [
    {
      id: 'sec-1',
      num: 'Section 1',
      title: 'Introduction and Overview',
      content: `The E-JUST Sumo Robot Competition tests engineering ingenuity, control design, sensor integration and mechanical design. Two robots face off inside a circular ring (the Dohyo). The objective is to push, ram or otherwise displace the opposing robot out of the ring. The last robot remaining inside the Dohyo wins the round. Both autonomous and manual wireless control modes are permitted and treated equally without distinction. Wired (tethered) control is strictly prohibited. The tournament awards 1st, 2nd, and 3rd place from knockouts, alongside a 100-point special prize evaluated by three independent judges (Section 14).`
    },
    {
      id: 'sec-2',
      num: 'Section 2',
      title: 'Definitions',
      items: [
        { term: 'Dohyo', desc: 'The circular sumo ring on which matches are fought.' },
        { term: 'Match', desc: 'A contest between two teams and their robots, played as best of 3 rounds (first team to win 2 rounds wins the match).' },
        { term: 'Round', desc: 'One fight, lasting at most 2 minutes, won by pushing the opponent out or via the bottle tiebreaker challenge (Section 10.2).' },
        { term: 'Shikiri-Sen', desc: 'The two start lines on the Dohyo behind which the robots are placed.' },
        { term: 'Homologation', desc: 'Technical inspection of a robot before it may compete (Section 7).' },
        { term: 'Safe area', desc: 'The area marked by the organizers where operators and assistants stand while a round is running.' }
      ]
    },
    {
      id: 'sec-3',
      num: 'Section 3',
      title: 'Teams, Participants and Conduct Before Matches',
      bullets: [
        '3.1 Team composition: A team has 6 members in total: the regular team members and one team leader.',
        'Recording a match is allowed and may be done by any team member. The referee’s decision does not depend on recordings.',
        '3.2 Team room, schedule and lateness: Robots are handed to organizers at event start for technical inspection (Section 7). Teams stay in their reserved room and leave only when called by an official.',
        'Punctuality: A team called to play that does not arrive within 5 minutes loses the match (§3.2).',
        '3.3 Robot number: Each robot must visibly display the organizer-issued number on its casing for referee identification.'
      ]
    },
    {
      id: 'sec-4',
      num: 'Section 4',
      title: 'Robot Specifications',
      table: [
        { param: 'Maximum Mass', spec: '3000 g (3 kg)', note: 'Measured at technical inspection on organizer scale' },
        { param: 'Start Dimensions', spec: 'Fits inside 20 cm × 20 cm square', note: 'Checked by organizers at inspection before tournament' },
        { param: 'Height', spec: 'Not restricted', note: 'Must not exceed the total diameter of the Dohyo (154 cm)' },
        { param: 'Expansion After Start', spec: 'Allowed', note: 'Must stay one centralized robot and must not separate into pieces' },
        { param: 'Control Mode', spec: 'Autonomous or Manual (Wireless only)', note: 'Wired control prohibited. Autonomous and manual treated equally' },
        { param: 'Emergency Stop', spec: '2 buttons required', note: '1 physical switch on robot, 1 wireless remote kill switch' },
        { param: 'Battery', spec: 'Secured and inspected', note: 'No visibly damaged, swollen or leaking cells' },
        { param: 'Durability', spec: 'Must withstand match contact', note: 'Verified by impact rig test in Section 7' }
      ]
    },
    {
      id: 'sec-5',
      num: 'Section 5',
      title: 'Robot Restrictions (Permitted vs Prohibited)',
      permitted: [
        'Impact and ramming mechanisms: rams, wedges, front blades (plows) and spring-loaded push mechanisms.',
        'Sensors of any kind (IR distance, line, ultrasonic, ToF, laser rangefinders).',
        'Flags: up to two, optional, fabric/paper with plastic pole; must stand vertically inside perimeter before start.'
      ],
      prohibited: [
        'Parts that break, scratch or damage the Dohyo ring surface.',
        'Parts intended to damage the opponent: blades, spikes, drills, saws, hammers, or destructive pistons.',
        'Substances: liquids, powders, gas or spraying devices.',
        'Flaming or ignition devices, shooting/projectiles or separating parts.',
        'Sticky substances: wheels must pass the A4 paper test (must not hold an 80 g/m² sheet for > 2 seconds).',
        'Suction, vacuum fans or artificial downforce magnets/glue to fix to the Dohyo.',
        'Active jamming (lasers, blinding flashes, active infrared jamming aimed at opponent).'
      ]
    },
    {
      id: 'sec-6',
      num: 'Section 6',
      title: 'Dohyo (Arena) Specifications',
      specs: [
        { label: 'Shape & Diameter', val: 'Circular, 154 cm (1540 mm) in diameter' },
        { label: 'Surface Color & Base', val: 'Matte black wood, 10 cm base elevation' },
        { label: 'Tawara Border', val: 'White circular ring, 5 cm (50 mm) wide, outer edge' },
        { label: 'Shikiri-Sen (Start Lines)', val: 'Two white lines, 20 cm long × 3 mm wide, 10 cm apart, centered' }
      ]
    },
    {
      id: 'sec-8',
      num: 'Section 8',
      title: 'Match Procedure & Officials',
      bullets: [
        '8.1 Officials: Each match is supervised by three referees: a Principal Referee and two Assistant Referees. The Principal Referee’s decision on safety and rules is final.',
        '8.2 Format & Duration: Best of 3 rounds. First team to win two rounds wins the match. Each round lasts at most 2 minutes.',
        '8.3 Placing the Robots: Approached on referee command. Robots placed behind Shikiri-Sen simultaneously. Facing direction decided by referee.',
        '8.4 Start: Started on referee signal. Premature movement triggers a restart warning; repeated violations forfeit the round.',
        '8.6 Breaks: At most 1 minute between rounds to clean tires and select tactics. Reprogramming or battery changes are strictly prohibited during a match.'
      ]
    },
    {
      id: 'sec-9',
      num: 'Section 9',
      title: 'Scoring Rules (When a Round is Won)',
      bullets: [
        'A team legally forces the body of the opposing robot to touch the space outside the Dohyo.',
        'The opposing robot touches the space outside the Dohyo on its own (drives or falls out unforced).',
        'One or more wheels of the opposing robot run over the edge of the Dohyo, and the referee counts to three while the robot cannot return onto the Dohyo.',
        'The opposing robot is damaged by itself (a malfunction not caused by the opponent), cannot continue, and its team representative announces it.'
      ]
    },
    {
      id: 'sec-10',
      num: 'Section 10',
      title: 'Restarts, Stalls & Bottle Tiebreaker',
      bullets: [
        'Robot does not start: one restart. If same robot fails to start again, round awarded to opponent.',
        'Entangled or orbiting with no progress for 10 seconds: one restart. If repeated, referees decide round via tiebreaker.',
        'Both robots stand still without touching for 10 seconds, or move without progress: one restart.',
        'Simultaneous exit: if unclear who touched outside first, round is replayed.',
        '10.2 Bottle Tiebreaker Challenge: If 2 minutes end without a winner, or if a stalled situation repeats, an upright bottle is placed at the far end of the ring. Each robot is placed in the ring individually to hit the bottle in the shortest time. The robot with the shortest elapsed time wins the round.'
      ]
    },
    {
      id: 'sec-14',
      num: 'Section 14',
      title: 'Prizes and Judging Criteria (100 Points Total)',
      prizes: [
        { name: '1. Best Mechanical Design (25 pts)', desc: 'Chassis structure, weight distribution, stability, traction, and efficient use of dimensions/materials.' },
        { name: '2. Most Competitive Robot (25 pts)', desc: 'Strongest fighting performance: aggressive engagement, pushing power, recovery from difficult positions, consistent operation.' },
        { name: '3. Best Engineering Innovation (25 pts)', desc: 'Clever, original technical solution in sensing, control, mechanics, or integration. Usefulness over complexity.' },
        { name: '4. Sportsmanship Award (25 pts)', desc: 'Respect toward opponents, referees, and organizers, adhering to rules with a positive attitude in victory and defeat.' }
      ],
      process: 'Every team’s robot and matches are revised by three independent judges. Each judge fills out a separate scoring sheet out of 100 points (25 points per criterion). A designated official calculates the average of the three judges’ points; the team with the highest average score wins the prize.'
    }
  ];

  return (
    <div className="space-y-6 pb-16">
      {/* Handbook Top Header */}
      <div className="p-5 rounded-lg bg-[#14060d] border border-[#2b0f19] flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-[10px] font-mono uppercase tracking-wider font-bold text-[#c5a059] bg-[#220a13] px-2 py-0.5 rounded border border-[#c5a059]/30">
              Official Tournament Codex
            </span>
            <span className="text-xs text-gray-400">IEEE RAS E-JUST SBC • 10-Page Handbook Reference</span>
          </div>
          <h2 className="text-lg font-bold text-white tracking-tight">
            Sumo Robot Competition Official Regulations
          </h2>
          <p className="text-xs text-gray-400 mt-0.5">
            Full compliance guide for referees, inspectors, and judges. All tournament operations strictly follow this handbook.
          </p>
        </div>

        <button
          onClick={() => window.print()}
          className="flex items-center gap-1.5 px-3 py-1.5 rounded bg-[#1f0b14] border border-[#3b1222] text-[#c5a059] text-xs font-mono font-semibold hover:bg-[#2b0f1b]"
        >
          <Printer className="w-3.5 h-3.5" />
          <span>Print Handbook Digest</span>
        </button>
      </div>

      {/* Dohyo Arena Physical Geometry Diagram */}
      <div className="p-5 rounded-lg bg-[#120509] border border-[#2b0f19] grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
        <div className="md:col-span-5 flex flex-col items-center justify-center p-4 rounded bg-[#0a0205] border border-[#200712]">
          {/* Ring Visual */}
          <div className="w-44 h-44 rounded-full border-4 border-gray-100 bg-[#16060e] relative flex items-center justify-center shadow-inner">
            <div className="absolute inset-1 rounded-full border border-gray-400/30" />
            
            {/* Shikiri-Sen */}
            <div className="flex gap-8 items-center justify-center">
              <div className="w-1 h-10 bg-[#c5a059] rounded" />
              <div className="w-1 h-10 bg-rose-500 rounded" />
            </div>

            <span className="absolute bottom-4 text-[9px] font-mono text-gray-400">
              1540 mm Diameter
            </span>
          </div>

          <div className="text-xs font-mono font-bold text-white mt-3">
            Official Dohyo Ring Dimensions (§6)
          </div>
          <div className="text-[10px] text-gray-400 font-mono">
            Wood (Matte Black) • 10 cm Base Height
          </div>
        </div>

        <div className="md:col-span-7 space-y-2 text-xs">
          <div className="text-sm font-bold text-white pb-1 border-b border-[#240a15]">
            Key Arena Specifications (Section 6)
          </div>
          <div className="grid grid-cols-2 gap-2 text-xs">
            <div className="p-2 rounded bg-[#0a0205] border border-[#200712]">
              <span className="text-gray-500 block text-[10px] font-mono uppercase">Tawara (Border Line)</span>
              <span className="text-white font-semibold">5 cm (50 mm) White Ring</span>
            </div>
            <div className="p-2 rounded bg-[#0a0205] border border-[#200712]">
              <span className="text-gray-500 block text-[10px] font-mono uppercase">Shikiri-Sen (Start Lines)</span>
              <span className="text-white font-semibold">20 cm × 3 mm, 10 cm apart</span>
            </div>
            <div className="p-2 rounded bg-[#0a0205] border border-[#200712]">
              <span className="text-gray-500 block text-[10px] font-mono uppercase">Mass Limit (§4)</span>
              <span className="text-white font-semibold">3000 g (3.0 kg) Max</span>
            </div>
            <div className="p-2 rounded bg-[#0a0205] border border-[#200712]">
              <span className="text-gray-500 block text-[10px] font-mono uppercase">Start Envelope (§4)</span>
              <span className="text-white font-semibold">20 cm × 20 cm Square</span>
            </div>
          </div>

          <div className="p-2.5 rounded bg-[#1c0812] border border-[#3b1222] text-[11px] text-rose-200">
            <strong>Referee Placing Rule (§8.3):</strong> Both teams place robots behind their Shikiri-Sen simultaneously on referee signal. Robots may start anywhere behind their own line; crossing the line toward the opponent before the signal is prohibited.
          </div>
        </div>
      </div>

      {/* Structured Sections Accordion / Grid */}
      <div className="space-y-4">
        {handbookSections.map((sec) => (
          <div key={sec.id} className="p-5 rounded-lg bg-[#120509] border border-[#2b0f19] space-y-3">
            <div className="flex items-center justify-between pb-2 border-b border-[#240a15]">
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono font-bold text-[#c5a059] uppercase px-1.5 py-0.5 rounded bg-[#1f0b14] border border-[#3b1222]">
                  {sec.num}
                </span>
                <h3 className="text-sm font-bold text-white">
                  {sec.title}
                </h3>
              </div>
            </div>

            {sec.content && (
              <p className="text-xs text-gray-300 leading-relaxed">
                {sec.content}
              </p>
            )}

            {sec.items && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                {sec.items.map((it, idx) => (
                  <div key={idx} className="p-2.5 rounded bg-[#0a0205] border border-[#200712]">
                    <div className="font-bold text-[#c5a059] font-mono">{it.term}</div>
                    <div className="text-[11px] text-gray-400 mt-0.5">{it.desc}</div>
                  </div>
                ))}
              </div>
            )}

            {sec.bullets && (
              <ul className="space-y-1.5 text-xs text-gray-300">
                {sec.bullets.map((b, idx) => (
                  <li key={idx} className="flex items-start gap-2 leading-relaxed">
                    <span className="text-[#c5a059] font-mono text-[11px] mt-0.5">•</span>
                    <span>{b}</span>
                  </li>
                ))}
              </ul>
            )}

            {sec.table && (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#17060e] text-gray-400 font-mono text-[10px] uppercase">
                      <th className="py-1.5 px-2.5">Parameter</th>
                      <th className="py-1.5 px-2.5">Specification</th>
                      <th className="py-1.5 px-2.5">Details and Restrictions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-[#1b0811] font-mono text-[11px]">
                    {sec.table.map((row, idx) => (
                      <tr key={idx} className="hover:bg-[#1a0812]/40">
                        <td className="py-1.5 px-2.5 font-bold text-white">{row.param}</td>
                        <td className="py-1.5 px-2.5 text-[#c5a059]">{row.spec}</td>
                        <td className="py-1.5 px-2.5 text-gray-400 font-sans text-xs">{row.note}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}

            {sec.permitted && (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
                <div className="p-3 rounded bg-[#07130c] border border-emerald-950 space-y-1.5">
                  <div className="font-bold text-emerald-400 font-mono text-[11px] uppercase flex items-center gap-1.5">
                    <Check className="w-3.5 h-3.5" />
                    <span>Permitted (§5.1)</span>
                  </div>
                  <ul className="space-y-1 text-gray-300 text-[11px]">
                    {sec.permitted.map((p, i) => (
                      <li key={i}>• {p}</li>
                    ))}
                  </ul>
                </div>

                <div className="p-3 rounded bg-[#17050a] border border-rose-950 space-y-1.5">
                  <div className="font-bold text-rose-400 font-mono text-[11px] uppercase flex items-center gap-1.5">
                    <Ban className="w-3.5 h-3.5" />
                    <span>Prohibited (§5.2)</span>
                  </div>
                  <ul className="space-y-1 text-gray-300 text-[11px]">
                    {sec.prohibited.map((p, i) => (
                      <li key={i}>• {p}</li>
                    ))}
                  </ul>
                </div>
              </div>
            )}

            {sec.prizes && (
              <div className="space-y-2 text-xs">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {sec.prizes.map((pz, idx) => (
                    <div key={idx} className="p-2.5 rounded bg-[#0a0205] border border-[#200712]">
                      <div className="font-bold text-white">{pz.name}</div>
                      <div className="text-[11px] text-gray-400 mt-0.5">{pz.desc}</div>
                    </div>
                  ))}
                </div>
                <p className="text-[11px] text-gray-400 italic pt-1 border-t border-[#240a15]">
                  {sec.process}
                </p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Official Contacts (Handbook Section 15) */}
      <div className="p-5 rounded-lg bg-[#14060d] border border-[#2b0f19] space-y-3">
        <div className="text-xs font-mono font-bold uppercase text-[#c5a059] pb-1 border-b border-[#240a15]">
          Section 15 • Competition Contacts & Chapter Inquiries
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          {TOURNAMENT_METADATA.contacts.map((c, idx) => (
            <div key={idx} className="p-3 rounded bg-[#0b0307] border border-[#240a15] space-y-1">
              <div className="font-bold text-white flex items-center justify-between">
                <span>{c.name}</span>
                <span className="text-[10px] font-mono text-gray-500">{c.role}</span>
              </div>
              <div className="text-[11px] text-gray-400 flex items-center gap-1.5 font-mono">
                <Mail className="w-3 h-3 text-[#c5a059]" />
                <a href={`mailto:${c.email}`} className="hover:underline">{c.email}</a>
              </div>
              <div className="text-[11px] text-gray-400 flex items-center gap-1.5 font-mono">
                <Phone className="w-3 h-3 text-[#c5a059]" />
                <span>{c.phone}</span>
              </div>
            </div>
          ))}
        </div>
        <div className="text-[11px] text-gray-500 text-center font-mono pt-1">
          Issued by the IEEE Robotics & Automation Society E-JUST Student Branch Chapter.
        </div>
      </div>
    </div>
  );
}
