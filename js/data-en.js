/* =====================================================================
   M.A.P. to Tomorrow — English content (영어판)
   ---------------------------------------------------------------------
   · data.js (한국어·스페인어)를 읽은 다음 이 파일이 영어(en)를 덧붙여요.
   · 한국어 내용을 고치면 여기의 같은 id 부분도 함께 고쳐 주세요.
   · 영어가 비어 있으면 한국어가 대신 나와요.
   ===================================================================== */
(function () {
  'use strict';

  const EN = {
    madeBy: 'Singeomdan Elementary School, Incheon (Grade 6) · UN Veterans Global Academy, Ministry of Patriots and Veterans Affairs',

    stations: {
      war: {
        short: 'The war',
        name: 'What was the Korean War?',
        date: 'Jun 25, 1950 – Jul 27, 1953',
        place: 'The whole Korean Peninsula',
        story: 'At dawn on June 25, 1950, North Korean troops crossed the 38th parallel and invaded the South. The war lasted more than three years, and countless people lost their families and homes. Many countries came to help South Korea under the flag of the United Nations.',
        find: {
          q: 'Where is the 38th parallel that the North Korean army crossed? Tap the map where the line runs!',
          hint: 'Hint: it runs across the "waist" of the peninsula, a little north of Seoul.',
          explain: 'The 38th parallel divided the peninsula into North and South after Korea\'s liberation in 1945. At dawn on June 25, 1950, the North Korean army crossed this line.'
        },
        timeline: [
          ['Jun 25, 1950', 'At dawn, North Korean troops crossed the 38th parallel in a surprise attack.'],
          ['Aug 1950', 'South Korean and UN forces were pushed back to the Nakdong River and held the last defense line.'],
          ['Sep – Nov 1950', 'The Incheon Landing succeeded! Seoul was retaken and the UN forces advanced far to the north.'],
          ['Oct 1950 – Jan 1951', 'Chinese troops joined the war, and the UN forces had to retreat again (the January 4 Retreat).'],
          ['1951 – 1953', 'Fierce battles for hills near the 38th parallel. This is when the Colombia Battalion fought!'],
          ['Jul 27, 1953', 'The Armistice Agreement was signed at Panmunjom, creating today\'s armistice line.']
        ],
        videos: ['The Story of the Korean War', 'The Korean War in a history cartoon'],
        quiz: {
          q: 'During the Korean War, only the United States came to help South Korea.',
          explain: 'No! 22 countries helped: 16 sent combat troops and 6 sent medical support. Colombia was one of them.'
        }
      },
      incheon: {
        short: 'Incheon',
        name: 'The Incheon Landing',
        date: 'Sep 15, 1950',
        place: 'Wolmido and Palmido, Incheon',
        story: 'Incheon has a huge difference between high and low tide, so it was very hard for ships to get in. People even said the plan had "a 1 in 5,000 chance" of success. But the Palmido lighthouse was lit, and at dawn the troops landed first on Wolmido. The operation succeeded, and Seoul was retaken on September 28!',
        videos: ['The Incheon Landing recreated with AI', 'An operation that depended on one lighthouse (Palmido)', 'Interview: the Palmido lighthouse operation', 'Operation X-Ray: the hidden heroes', 'The secret spy mission X-RAY', 'The Battle of Bupyeong'],
        quiz: {
          q: 'Where did the troops land first in the Incheon Landing?',
          options: ['Wolmido', 'Ganghwado', 'Jejudo', 'Ulleungdo'],
          explain: 'Wolmido! The landing began there at about 6:30 a.m. on September 15, 1950.'
        }
      },
      colombia: {
        short: 'Departure',
        name: 'Colombia\'s Decision',
        date: '1950 – 1951',
        place: 'Colombia, on the other side of the world',
        story: 'Colombia is on the other side of the world from Korea. The language, food and customs were all different, but Colombia was the only country in Latin America to send combat troops. The Army\'s "Colombia Battalion" and three Navy frigates crossed the ocean.',
        videos: ['First look: photos of Colombian soldiers in the Korean War', 'The 4,058 Colombian soldiers (KBS documentary, English subtitles)', '(Spanish) The Colombia Battalion in the Korean War'],
        heroes: [{
          author: 'From our interview with the veteran',
          name: 'Mr. Jaime Álvarez',
          role: 'Colombian Navy veteran · 92 years old',
          body: 'He protected the seas of Korea in the Colombian Navy. "I didn\'t know much about Korea, but I knew that someone wanted to invade it and force their ideas on it. So I went to defend freedom."'
        }],
        quiz: {
          q: 'Which was the only Latin American country to send combat troops to the Korean War?',
          options: ['Brazil', 'Colombia', 'Mexico', 'Argentina'],
          explain: 'Colombia! That is why Korea and Colombia call each other "brother nations".'
        }
      },
      busan: {
        short: 'Busan',
        name: 'Arrival in Busan',
        date: 'Jun 15, 1951',
        place: 'Port of Busan',
        story: 'On May 21, 1951, the 1,083 men of the Colombia Battalion boarded a US transport ship at the port of Buenaventura, Colombia. After about 25 days crossing the Pacific, they arrived in Busan on June 15 and were given a grand welcome. The battalion joined the US 24th Infantry Division on the central front. In total, Colombia sent about 5,100 soldiers and sailors during the war.',
        heroes: [{
          author: 'Hero researched by Group 1',
          name: 'Commander Jaime Polanía Puyo',
          role: 'First commander of the Colombia Battalion',
          body: 'He was the first commander of the Colombian infantry battalion and led more than 1,000 soldiers on their first steps in Korea.'
        }],
        find: {
          q: 'Where is the port of Busan, where the Colombia Battalion arrived? Tap it on the map!',
          hint: 'Hint: at the bottom-right tip of the peninsula, by the sea.',
          explain: 'Busan is the big port at the southeast tip of the peninsula. It was defended until the end of the war, so it became the UN forces\' gateway into Korea.'
        },
        quiz: {
          q: 'About how many days did the Colombia Battalion spend crossing the Pacific to Korea?',
          options: ['3 days', 'About 25 days', 'About 100 days', '1 year'],
          explain: 'They left on May 21 and arrived on June 15: about 25 days! Today the trip takes one day by plane, but back then it took almost a month by ship.'
        }
      },
      heukun: {
        short: 'Heukuntoryeong',
        name: 'Battle of Heukuntoryeong',
        date: 'Aug 6, 1951',
        place: 'Central front, Gangwon (south of Kumsong, Hill 851)',
        story: 'On August 6, 1951, the Colombia Battalion fought its first battle. Among tall mountains and unfamiliar weather, the Colombian soldiers bravely climbed toward Hill 851, held by the enemy.',
        videos: ['"We will always remember our Colombian allies" (Defense News)'],
        quiz: {
          q: 'The Battle of Heukuntoryeong was the Colombia Battalion\'s first battle in Korea.',
          explain: 'Correct! It was their first battle, on August 6, 1951, less than two months after arriving in Busan.'
        }
      },
      geumseong: {
        short: 'Kumsong',
        name: 'Kumsong Offensive',
        date: 'Oct 1951',
        place: 'Kumsong area, Gangwon (now north of the armistice line)',
        story: 'In October 1951, the Colombia Battalion joined the US 24th Infantry Division in "Operation Nomad". It pushed north toward Kumsong and captured enemy hills such as Hill 570.',
        quiz: {
          q: 'Which country\'s troops did the Colombia Battalion mainly fight alongside?',
          options: ['United Kingdom', 'France', 'Türkiye', 'United States'],
          explain: 'The United States! The Colombia Battalion was part of a US division and fought together with it.'
        }
      },
      hill400: {
        short: 'Hill 400',
        name: 'Battle of Hill 400',
        date: 'Jun 21, 1952',
        place: 'Gimhwa area, Gangwon (central front)',
        story: 'On June 21, 1952, the Colombia Battalion, then part of the US 7th Infantry Division, made a surprise attack on enemy positions on Hill 400 near Gimhwa. The quick attack destroyed the enemy positions, but 2 Colombian soldiers were killed and 15 were wounded.',
        quiz: {
          q: 'The "400" in "Hill 400" means the height of the hill (about 400 m).',
          explain: 'Correct! The number in a hill\'s name is its height in meters on the map. That\'s why they are called Hill 400, Hill 180, and so on.'
        }
      },
      hill180: {
        short: 'Hill 180',
        name: 'Battle of Hill 180',
        date: 'Mar 10, 1953',
        place: 'Yeoncheon area, Gyeonggi',
        story: 'Before dawn on March 10, 1953, the Colombia Battalion launched a surprise attack on Hill 180 in Yeoncheon, called "Operation Bárbula". This quick raid showed the courage of the battalion. Two weeks later, its hardest battle was waiting: Old Baldy.',
        quiz: {
          q: 'What was the name of the operation in which the Colombia Battalion raided Hill 180?',
          options: ['Operation Bárbula', 'Operation Nomad', 'Operation X-RAY', 'Operation Chromite'],
          explain: 'Operation Bárbula! Nomad was the Kumsong offensive, X-RAY was the spy mission on Yeongheungdo, and Chromite was the Incheon Landing.'
        }
      },
      oldbaldy: {
        short: 'Old Baldy',
        name: 'Battle of Old Baldy',
        date: 'Mar 23 – 24, 1953',
        place: 'Yeoncheon area, Gyeonggi',
        story: '"Old Baldy" (Bulmo-goji in Korean) means a hill so heavily bombed that not a single plant was left. It was the hardest and saddest battle for the Colombia Battalion. Many soldiers were wounded or killed, but they fought to the end to protect their comrades.',
        videos: ['(Spanish) The Demons of the Trenches'],
        quiz: {
          q: 'What does the name "Old Baldy" (Bulmo-goji) mean?',
          options: ['A mountain with lots of snow', 'A bare hill without a single plant', 'A mountain with buried treasure', 'A mountain where many birds live'],
          explain: 'That\'s right. Just the name tells you how fierce the fighting was.'
        }
      },
      armistice: {
        short: 'Panmunjom',
        name: 'Armistice at Panmunjom',
        date: 'Jul 27, 1953',
        place: 'Panmunjom',
        find: {
          q: 'Where is Panmunjom, where the Armistice Agreement was signed? Follow the armistice line and tap it!',
          hint: 'Hint: near the western (left) end of the armistice line, a little north of Seoul.',
          explain: 'Panmunjom is a village on the armistice line. The Armistice Agreement was signed there on July 27, 1953, and it is still where North and South meet.'
        },
        story: 'After 3 years and 1 month of fighting, the Armistice Agreement was signed at Panmunjom and the guns fell silent. It was not an "end" to the war but a "pause" in the fighting, so the armistice line still exists today.',
        quiz: {
          q: 'The Armistice Agreement completely ended the war.',
          explain: 'No. An armistice only stops the fighting. That is why we must keep working to protect peace.'
        }
      },
      westsea: {
        short: 'Navy',
        name: 'The Colombian Navy in the Yellow Sea',
        date: '1951 – 1955',
        place: 'Yellow Sea (Cho-do to Sok-do) · East Sea',
        story: 'In May 1951, the Almirante Padilla, the Colombian Navy\'s first ship, arrived in Korea. From May 14 it patrolled the Yellow Sea between the islands of Cho-do and Sok-do to block the enemy\'s sea routes, and in the East Sea it supported ground troops with its guns. The Colombian Navy kept guarding Korea\'s seas until 1955, even after the fighting stopped.',
        heroes: [
          { author: 'Story written by Group 5', name: 'The Colombian Navy that guarded the Yellow Sea', role: 'Defending the Yellow Sea', body: 'The Colombian Navy firmly guarded the waters of the Yellow Sea. To remember the sacrifice of the Colombian soldiers, there is a memorial in Gyeongmyeong Park in Incheon today.' },
          { author: 'Heroes researched by Group 1', name: 'The captain and crew of the Almirante Padilla', role: 'Colombian Navy', body: 'Heroes of the Colombian Navy who patrolled the Yellow Sea, blocked the enemy\'s sea routes and protected the UN forces\' sea lanes.' },
          { author: 'Story researched by Group 4', name: 'Frigates in the Yellow Sea and the East Sea', role: 'Naval blockade', body: 'The Colombian Navy sent frigates to help block the Yellow Sea and the East Sea. They cut off enemy supply lines, fired on the coast and supported UN landings to keep the seas safe.' }
        ],
        quiz: {
          q: 'What was the name of the first warship Colombia sent to Korea?',
          options: ['Almirante Padilla', 'Titanic', 'Turtle ship', 'Mayflower'],
          explain: 'Correct! The Colombian Navy sent three frigates: the Almirante Padilla, the Capitán Tono and the Almirante Brión.'
        }
      },
      memorial: {
        short: 'Memorial',
        name: 'Memorial to the Colombian Veterans',
        date: 'Built Sep 24, 1975 → moved Jul 25, 2018',
        place: 'Gyeongmyeong Park, Incheon',
        story: 'In Gyeongmyeong Park in Incheon stands the memorial to the Colombian soldiers of the Korean War. It has a statue of a soldier holding a sword, a woman kneeling in prayer, and a white wall shaped like a ship\'s sail. The stone carries words in Korean and Spanish remembering the sacrifice of 611 people. A memorial ceremony is held there every year.',
        videos: ['"Leave the hill battles to us!" The Colombian memorial', 'Reunion after 70 years: Colombian veterans visit Korea', '"I wanted to see the country my grandfather fought for"'],
        quiz: {
          q: 'What does the number 611 on the memorial mean?',
          options: ['The distance to Colombia', 'The date the memorial was built', 'The number of Colombian soldiers killed or wounded in the war', 'The number of a Colombian ship'],
          explain: 'The memorial says that "611 noble lives shed their blood." The number remembers the Colombian soldiers who were killed or wounded in the war. (The exact numbers differ a little between sources.)'
        }
      }
    },

    ops: {
      xray: {
        short: 'Operation X-RAY', name: 'Operation X-RAY on Yeongheungdo', date: 'Mid-Aug – Sep 14, 1950',
        text: 'On August 24, 1950, before the Incheon Landing, Major Ham Myeong-su and his team of navy spies, 17 in all, secretly slipped onto the island of Yeongheungdo. With help from the islanders, they found out how deep the sea was, where the tidal flats and hidden mines were, and where the enemy\'s guns and soldiers were, and reported it to the UN forces. The movie "Operation Chromite" is based on this true story.',
        heroes: [
          { name: 'Major Ham Myeong-su', text: 'Navy intelligence commander who led Operation X-RAY and found a safe route to Incheon' },
          { name: 'Lt. Im Byeong-rae · Sgt. Hong Si-uk', text: 'Heroes who were surrounded by the enemy on September 14, 1950, and gave their lives to protect the secret of the landing' }
        ]
      },
      palmido: {
        short: 'Lighthouse', name: 'Operation Palmido Lighthouse', date: 'Night of Sep 14 – early Sep 15, 1950',
        text: 'For ships to reach Incheon at night, they needed the Palmido lighthouse (built in 1903, Korea\'s first modern lighthouse) to light the dark sea. US Navy Lieutenant Clark, KLO group leader Choi Gyu-bong and Korean officers went onto Palmido, took back the lighthouse, and found and repaired the parts the enemy had taken. Just after midnight on September 15, the light came on, and 261 UN ships followed the narrow, dangerous channel into Incheon.',
        heroes: [
          { name: 'Choi Gyu-bong (KLO group leader)', text: 'Leader of the KLO "Goat" group, who went onto Palmido with Lt. Clark, retook the lighthouse and lit it' },
          { name: 'Lt. Eugene Clark', text: 'US Navy officer who hid on the islands two weeks before the landing to watch the sea at Incheon, and lit the Palmido lighthouse' }
        ]
      },
      wolmido: {
        short: 'Wolmido', name: 'Landing on Wolmido', date: 'Sep 15, 1950, about 6:30 a.m.',
        text: 'Wolmido is the island that guards the port of Incheon, so it had to be taken first before the main force could come in safely. Incheon\'s tide rises and falls by up to 10 meters and almost everyone was against the plan, but at about 6:30 a.m. on September 15, at high tide, US Marines landed on Wolmido first and destroyed the North Korean positions.',
        heroes: [
          { name: 'General Douglas MacArthur', text: 'UN commander who planned and led the Incheon Landing, an operation so hard that people spoke of "a 1 in 5,000 chance"' },
          { name: 'Admiral Sohn Won-il', text: 'Son of independence activist Pastor Son Jeong-do; he founded the navy and led its fleet in the Incheon Landing — "the father of the Korean Navy"' }
        ]
      },
      port: {
        short: 'Incheon port', name: 'Main Landing at Incheon Port', date: 'Sep 15, 1950, about 5:30 p.m.',
        text: 'That afternoon at about 5:30, with the second high tide, US Marines landed at Red Beach and Blue Beach. They climbed the high sea walls with ladders and entered the city, and that night Korean Marines followed them ashore. Thanks to this operation, with about 75,000 troops and 261 ships, Seoul was retaken 13 days later, on September 28. Nine months later, in June 1951, Colombia sent ground troops to fight alongside the UN forces.',
        heroes: []
      },
      bupyeong: {
        short: 'Bupyeong', name: 'Battle of Bupyeong & Yellow Sea Blockade', date: 'From Sep 16, 1950',
        text: 'After Incheon was retaken, on September 17 the Allied forces, led by the US Marines, defeated a North Korean tank unit at Wontong Pass in Bupyeong and opened the road to Seoul. Today there is a victory monument for the Battle of Bupyeong at the Bupyeong Art Center. At sea, the UN forces blocked the Yellow Sea to cut off enemy movements and supplies, and the Colombian Navy, which came later, also guarded the Yellow Sea.',
        heroes: [
          { name: 'Kim Dong-seok (Army intelligence officer)', text: 'Intelligence officer (later a colonel) who gathered information about the enemy on the road from Incheon to Seoul and helped retake Seoul' }
        ]
      }
    },

    cards: {
      battalion: {
        name: 'Colombia Battalion', role: 'Latin America\'s only combat unit in the war',
        deeds: [
          'The infantry unit of Colombia, the only Latin American country that sent combat troops.',
          'It fought on the central front as part of the US 24th and later the US 7th Infantry Division.',
          'It fought bravely at Heukuntoryeong (Aug 1951), Kumsong (Oct 1951), Hill 400 (Jun 1952), and Hill 180 and Old Baldy (Mar 1953).',
          'About 5,100 Colombian soldiers and sailors came during the war, and many of them were wounded or killed.'
        ]
      },
      polania: {
        name: 'Lt. Col. Jaime Polanía Puyo', role: 'First commander of the Colombia Battalion',
        deeds: [
          'On May 21, 1951, he left the port of Buenaventura, Colombia, leading 1,083 soldiers.',
          'He arrived in Busan on June 15 and advanced to the central front with the US 24th Infantry Division.',
          'He led the battalion in its first battle at Heukuntoryeong and in the Kumsong offensive (Operation Nomad).'
        ]
      },
      padilla: {
        name: 'ARC Almirante Padilla', role: 'Colombia\'s first warship in the war (frigate)',
        deeds: [
          'Colombia\'s first warship in the Korean War: it left Colombia in November 1950 and reached Korean waters in May 1951.',
          'From May 14, 1951, it patrolled the Yellow Sea between Cho-do and Sok-do to block the enemy.',
          'In the East Sea it supported ground troops with its guns. Later the Capitán Tono and the Almirante Brión came too, three ships in all.'
        ]
      },
      alvarez: {
        name: 'Jaime Álvarez', role: 'Colombian Navy veteran',
        deeds: [
          'He protected the seas of Korea aboard a Colombian Navy warship. In his video he told us he served on the Almirante Padilla.',
          'He sailed the Yellow Sea, the East Sea and the waters south of the peninsula, patrolling the seas around Korea.',
          'At 92, he sent a video reply to the questions of our 6th graders: "Brothers in war, brothers in peace."'
        ]
      },
      suarez: {
        name: 'Jorge Suárez', role: 'Colombian veteran',
        deeds: [
          'He fought in the Korean War together with his comrades.',
          'He told us: "The hardest moments were seeing my comrades fall."',
          'He sent a message to our 6th graders: "Keep the peace you have."'
        ]
      },
      sonwonil: {
        name: 'Admiral Sohn Won-il', role: 'Father of the Korean Navy',
        deeds: [
          'He was the son of Pastor Son Jeong-do, an independence activist.',
          'After liberation, in November 1945, he founded the Maritime Defense Corps, the root of the Korean Navy, and became the navy\'s first Chief of Naval Operations.',
          'In the Incheon Landing, as the highest-ranking Korean commander, he led the Korean Navy and Marines.',
          'In 1953 he became Minister of National Defense.'
        ]
      },
      hammyeongsu: {
        name: 'Major Ham Myeong-su', role: 'Navy intelligence commander · Operation X-RAY',
        deeds: [
          'On August 24, 1950, he secretly led a team of 17 navy spies, himself included, onto Yeongheungdo.',
          'He investigated the depth of the sea, the tidal flats and the enemy\'s positions at Incheon, and reported them to the UN forces.',
          'This information opened the way for the Incheon Landing. He later became the 7th Chief of Naval Operations (1964–1966).'
        ]
      },
      imhong: {
        name: 'Lt. Im Byeong-rae · Sgt. Hong Si-uk', role: 'Members of Operation X-RAY',
        deeds: [
          'As members of Operation X-RAY, they gathered information on Yeongheungdo that the Incheon Landing needed.',
          'On September 14, 1950, when they were surrounded by the enemy, they gave their lives to protect the secret of the operation.',
          'Korea awarded them the Eulji Order of Military Merit, and the United States awarded them the Silver Star.',
          'In September 2014 they were named "Korean War Heroes of the Month". Im was a second lieutenant at the time and was promoted to first lieutenant after his death.'
        ]
      },
      choigyubong: {
        name: 'Choi Gyu-bong', role: 'Leader of the KLO "Goat" group',
        deeds: [
          'He led the "Goat" group of the KLO unit, which gathered intelligence behind enemy lines.',
          'On September 14, 1950, he went onto Palmido with Lt. Clark and Korean officers and took back the lighthouse.',
          'Just after midnight on September 15, the lighthouse was lit, opening the way for 261 ships.'
        ]
      },
      kimdongseok: {
        name: 'Kim Dong-seok', role: 'Army intelligence officer (later a colonel)',
        deeds: [
          'In September 1950, he was a Korean intelligence officer working with the US Eighth Army.',
          'He gathered information about the enemy on the road from Incheon to Seoul and sent it to MacArthur\'s headquarters.',
          'His information was used to retake Seoul and advance north. In September 2016 he was named a "Korean War Hero of the Month".'
        ]
      },
      macarthur: {
        name: 'General Douglas MacArthur', role: 'Commander of the UN forces',
        deeds: [
          'He planned and led the Incheon Landing, even though almost everyone thought it was too difficult.',
          'The operation was so hard that people spoke of "a 1 in 5,000 chance", but it succeeded.',
          'He opened the way to retake Seoul on September 28, 13 days after the landing.'
        ]
      },
      clark: {
        name: 'Lt. Eugene Clark', role: 'US Navy intelligence officer',
        deeds: [
          'On September 1, 1950, he landed first on Deokjeokdo and then moved to Yeongheungdo, secretly watching the sea at Incheon for two weeks.',
          'Together with Korean team members, he took back the Palmido lighthouse.',
          'Just after midnight on September 15, he lit the lighthouse to guide the fleet, and he received the Silver Star.'
        ]
      }
    },

    glossary: [
      ['Armistice Agreement', 'An agreement to stop the fighting. It does not mean the war is completely over.'],
      ['armistice line', 'The border drawn where the fighting stopped under the Armistice Agreement.'],
      ['armistice', 'A pause in the fighting agreed by both sides. It is not a peace treaty.'],
      ['38th parallel', 'The line along latitude 38° that divided Korea into North and South after 1945.'],
      ['UN forces', 'Troops from many countries that came to help South Korea by decision of the United Nations.'],
      ['UN', 'The United Nations: an international organization of countries working for world peace.'],
      ['landing', 'Troops coming ashore from ships to fight on land.'],
      ['spies', 'People who secretly gather the enemy\'s secret information.'],
      ['intelligence officer', 'A soldier whose job is to gather and study secret information about the enemy.'],
      ['KLO', 'A Korean spy unit that gathered information behind enemy lines during the Korean War.'],
      ['fleet', 'A large group of warships.'],
      ['frigate', 'A medium-sized warship that protects other ships and patrols the sea.'],
      ['transport ship', 'A ship that carries soldiers and supplies.'],
      ['blockade', 'Blocking the way so the enemy cannot come in or go out.'],
      ['supplies', 'Food, weapons and clothes that soldiers need.'],
      ['Hill 400', 'A hill about 400 m high. Hills were named after their height on the map.'],
      ['battalion', 'A military unit of a few hundred to about a thousand soldiers.'],
      ['Infantry Division', 'A large military unit of more than ten thousand soldiers.'],
      ['Marines', 'Soldiers trained to fight both at sea and on land.'],
      ['veteran', 'A person who fought in a war.'],
      ['Chief of Naval Operations', 'The highest officer who leads the whole navy.'],
      ['Silver Star', 'A medal the United States gives for bravery in battle.'],
      ['Order of Military Merit', 'A medal Korea gives to people who did great deeds in war.'],
      ['front', 'The front line where the fighting happens.'],
      ['retreat', 'Moving back, away from the enemy.'],
      ['tidal flats', 'Wide muddy land that appears when the tide goes out.'],
      ['high tide', 'When the sea rises highest toward the land.'],
      ['liberation', 'Korea becoming free from Japanese rule in 1945.'],
      ['comrades', 'Fellow soldiers who fight together.'],
      ['tolerance', 'Kindly accepting people who are different from us.'],
      ['buoys', 'Floating markers that show ships the safe way.'],
      ['memorial', 'A monument built so that people remember an event or people.']
    ],

    // 질문 카드: 질문 원문은 data.js 의 en 을 그대로 써요. 여기는 참전용사 답변 요약.
    answers: {
      q1: [
        'For me, democracy is the freedom to make your own choices without anyone forcing you. I knew a country wanted to invade Korea and force its ideas on it, and I wanted to defend that freedom. That idea gave me the courage to go to a faraway country with a different language and customs.',
        'In my case, I wanted to get to know other lands. We were soldiers, and we wanted to know what war was, which we had only heard about, and to see other worlds.'
      ],
      q2: [
        'The hardest thing was seeing my comrades fall. When I saw a friend wounded or killed, it felt as if it had happened to me. Some of our friends were gone, but those of us who survived had to keep going.'
      ],
      q3: [
        'Having helped Korea has always been my pride. Seeing what Korea is today, I have come to truly love Korea and its people. As the famous saying goes: brothers in war, brothers in peace.',
        'After the war, the relationship between us and you has been very close. Thank you for remembering us after so many years. We are proud to have added a small grain of sand to your freedom.'
      ],
      q4: [
        'I am very proud that I decided to go and defend Korea. I feel Korea\'s success and progress after the war almost as if they were my own. Your country\'s success fills me with joy.',
        'I have not been back to Korea since the war, but I know how much it has grown in every way: economy, science and more. It is amazing, and it makes us Colombians very happy.'
      ],
      q5: [
        'The message of peace is to let go of hatred. We must not hate someone because they dress, act or think differently. Accept others the way you accept your own family. For me, the most important word is "tolerance": with tolerance, peace will come.',
        'Try to keep the peace you have and never go back to the moments of war. As future leaders, you will have the responsibility of keeping your country calm and peaceful. Remember what war teaches us.'
      ]
    },

    veterans: {
      jaime: { name: 'Jaime Álvarez', role: 'Navy veteran · 92 years old' },
      jorge: { name: 'Jorge Suárez', role: 'Veteran' }
    },
    links: [
      { name: 'Finding Heroes (Wall of Remembrance) app', desc: 'Look up the names and stories of Korean War veterans.' },
      { name: 'UN Veterans Digital Archive', desc: 'Real records of the veterans: interviews, photos, letters and more.' },
      { name: 'Ministry of Patriots and Veterans Affairs (Korea)', desc: 'The Korean government ministry that honors those who served the country.' }
    ],
    works: [
      'Group 1 · Five battles of Incheon and the heroes we must remember',
      'Group 2 · Battles Colombia fought in the Korean War',
      'Group 3 · Colombia',
      'Group 4',
      'Group 5 · Incheon in the Korean War: a day to remember'
    ]
  };

  /* ---------- data.js 에 영어(en) 덧붙이기 ---------- */
  const put = (obj, val) => { if (obj && typeof obj === 'object' && val != null && val !== '') obj.en = val; };
  const C = window.MAP_CONFIG || {};
  put(C.madeBy, EN.madeBy);

  (window.STATIONS || []).forEach((s) => {
    const e = EN.stations[s.id];
    if (!e) return;
    ['short', 'name', 'date', 'place', 'story'].forEach((k) => put(s[k], e[k]));
    if (s.find && e.find) ['q', 'hint', 'explain'].forEach((k) => put(s.find[k], e.find[k]));
    (s.timeline || []).forEach((t, i) => { if (e.timeline && e.timeline[i]) { put(t.date, e.timeline[i][0]); put(t.text, e.timeline[i][1]); } });
    (s.videos || []).forEach((v, i) => put(v.title, e.videos && e.videos[i]));
    (s.heroes || []).forEach((h, i) => { const eh = e.heroes && e.heroes[i]; if (eh) ['author', 'name', 'role', 'body'].forEach((k) => put(h[k], eh[k])); });
    if (s.quiz && e.quiz) {
      put(s.quiz.q, e.quiz.q); put(s.quiz.explain, e.quiz.explain);
      (s.quiz.options || []).forEach((o, i) => put(o, e.quiz.options && e.quiz.options[i]));
    }
  });
  (window.INCHEON_OPS || []).forEach((op) => {
    const e = EN.ops[op.id];
    if (!e) return;
    ['short', 'name', 'date', 'text'].forEach((k) => put(op[k], e[k]));
    (op.heroes || []).forEach((h, i) => { const eh = e.heroes && e.heroes[i]; if (eh) { put(h.name, eh.name); put(h.text, eh.text); } });
  });
  (window.HERO_CARDS || []).forEach((c) => {
    const e = EN.cards[c.id];
    if (!e) return;
    put(c.name, e.name); put(c.role, e.role);
    (c.deeds || []).forEach((d, i) => put(d, e.deeds[i]));
  });
  if (window.GLOSSARY) window.GLOSSARY.en = EN.glossary;
  Object.entries(window.QUESTIONS || {}).forEach(([qid, q]) => {
    put(q.text, q.en); // 질문 원문이 영어예요
    (q.answers || []).forEach((a, i) => put(a.summary, EN.answers[qid] && EN.answers[qid][i]));
  });
  Object.entries(window.VETERANS || {}).forEach(([k, v]) => { const e = EN.veterans[k]; if (e) { put(v.name, e.name); put(v.role, e.role); } });
  (window.LINKS || []).forEach((l, i) => { const e = EN.links[i]; if (e) { put(l.name, e.name); put(l.desc, e.desc); } });
  (window.GROUP_WORKS || []).forEach((w, i) => put(w.name, EN.works[i]));
})();
