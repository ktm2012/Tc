// Placeholder content for the UI-only phase, matching the approved mockups.
// Replace with real Prisma queries once posts/assets/projects are wired to the database.
import type { BannerTheme } from "@/components/ui/SceneBanner";

export type SampleComment = {
  author: { name: string; initial: string; color: string };
  body: string;
  createdAt: Date;
};

export type SamplePost = {
  slug: string;
  category: string;
  categoryColor: "pink" | "purple" | "blue" | "mint" | "peach";
  bannerTheme: BannerTheme;
  title: string;
  excerpt: string;
  body: string[];
  code?: { filename: string; content: string };
  tags: string[];
  author: { name: string; initial: string; color: string };
  createdAt: Date;
  sampleComments: SampleComment[];
  comments: number;
  viewCount: number;
};

// Fixed reference point instead of Date.now(): sample data has no database
// row to hold a real timestamp, so createdAt gets recomputed from "now"
// every time this module loads. Date.now() looked fine at a glance, but it
// meant every dev-server restart (or prod cold start) reset "2시간 전" back
// to exactly 2 hours before that moment — the posts never actually aged.
// Anchoring to a fixed point lets real elapsed time actually accumulate.
const REFERENCE_NOW = new Date("2026-08-25T10:00:00+09:00");
const hoursAgo = (h: number) =>
  new Date(REFERENCE_NOW.getTime() - h * 60 * 60 * 1000);
const daysAgo = (d: number) =>
  new Date(REFERENCE_NOW.getTime() - d * 24 * 60 * 60 * 1000);

const RAW_POSTS: Omit<SamplePost, "comments">[] = [
  {
    slug: "blender-uv-seam",
    category: "블렌더",
    categoryColor: "purple",
    bannerTheme: "blender",
    title:
      "캐릭터 UV 언랩할 때 씸(seam) 안 보이게 하려면 어떻게 해야 하나요?",
    excerpt:
      "웨이트 페인팅까지 해봤는데 어깨 쪽에서 텍스처가 계속 끊겨 보여요.",
    body: [
      "웨이트 페인팅까지 해봤는데 어깨 쪽에서 텍스처가 계속 끊겨 보여요. 씸 위치를 바꿔봐도 크게 나아지지 않네요.",
      "혹시 UV 언랩 단계에서부터 신경 써야 할 부분이 있을까요?",
    ],
    tags: ["블렌더", "UV", "텍스처"],
    author: { name: "mira_renders", initial: "미", color: "bg-accent2" },
    createdAt: hoursAgo(2),
    viewCount: 128,
    sampleComments: [
      {
        author: { name: "uvjanitor", initial: "U", color: "bg-accent" },
        body: "마진 좀 넉넉하게 주고 언랩해보세요, 저도 그걸로 많이 해결했어요.",
        createdAt: hoursAgo(1.5),
      },
      {
        author: { name: "riggybit", initial: "리", color: "bg-accent2" },
        body: "씸을 눈에 안 띄는 곳(겨드랑이 안쪽 등)으로 옮기는 것도 방법이에요.",
        createdAt: hoursAgo(1),
      },
    ],
  },
  {
    slug: "unity-nullreference-prefab",
    category: "유니티",
    categoryColor: "blue",
    bannerTheme: "unity",
    title: "런타임에 프리팹 생성할 때 NullReferenceException이 계속 떠요",
    excerpt:
      "에디터에서는 잘 되는데 빌드하면 바로 터져요. ScriptableObject 로드 순서 문제인 것 같아요.",
    body: [
      "에디터에서는 잘 되는데 빌드하면 바로 터져요. ScriptableObject 로드 순서 문제인 것 같은데 정확히 어디서 꼬이는지 못 찾겠어요.",
      "혹시 비슷한 문제 겪어보신 분 있을까요?",
    ],
    tags: ["유니티", "프리팹", "C#"],
    author: { name: "kdev_unity", initial: "케", color: "bg-accent" },
    createdAt: hoursAgo(5),
    viewCount: 341,
    sampleComments: [
      {
        author: { name: "nodewrangler", initial: "노", color: "bg-peach" },
        body: "혹시 Resources.Load로 불러오시나요? 빌드에서는 경로 대소문자 이슈로 자주 터지더라고요.",
        createdAt: hoursAgo(4),
      },
      {
        author: { name: "hexlumen", initial: "헥", color: "bg-accent" },
        body: "ScriptableObject가 에디터에서만 참조가 남아있고 빌드엔 안 포함된 거 아닐까요?",
        createdAt: hoursAgo(3),
      },
      {
        author: { name: "soundscape_yu", initial: "사", color: "bg-muted" },
        body: "AssetBundle/Addressables 쪽 경로면 빌드 후 스트리밍 에셋 폴더에 실제로 들어갔는지도 확인해보세요.",
        createdAt: hoursAgo(2),
      },
    ],
  },
  {
    slug: "urp-shader-lighting-bake",
    category: "셰이더",
    categoryColor: "mint",
    bannerTheme: "shader",
    title: "라이트맵 베이크하면 URP 셰이더가 까맣게 나오는 이유가 뭘까요?",
    excerpt:
      "베이크하는 순간 소품에 씌운 커스텀 셰이더가 완전히 검게 변해요. 콘솔 에러도 없어서 어디서부터 봐야 할지 모르겠어요.",
    body: [
      "커스텀 Lit 셰이더 그래프를 소품 여러 개에 쓰고 있어요. 실시간 렌더링에서는 다 잘 나오는데, Generate Lighting을 돌리는 순간 소품이 전부 새까맣게 변해요. 경고도 에러도 콘솔에 안 뜹니다.",
      "제가 커스텀 함수 노드에서 호출하는 라이팅 함수 일부는 아래와 같습니다.",
      "추측으로는 SampleSH가 베이크된 GI를 쓰려면 라이트맵 UV를 직접 넘겨줘야 할 것 같은데, Shader Graph 커스텀 함수 노드에서 깔끔하게 처리하는 방법을 못 찾겠어요. 혹시 겪어보신 분 있나요?",
    ],
    code: {
      filename: "URPLitShader.hlsl",
      content: `void CustomLighting_float(float3 Normal, float3 Position, out float3 Color)
{
  Light mainLight = GetMainLight();
  float3 lightDir = normalize(mainLight.direction);
  float NdotL = saturate(dot(Normal, lightDir));

  // 베이크 후에는 bakedGI가 0으로 나옵니다 — 이게 버그예요
  float3 bakedGI = SampleSH(Normal);
  Color = mainLight.color * NdotL + bakedGI;
}`,
    },
    tags: ["유니티", "URP", "셰이더", "라이팅"],
    author: { name: "shadyshaders", initial: "셰", color: "bg-peach" },
    createdAt: daysAgo(1),
    viewCount: 512,
    sampleComments: [
      {
        author: { name: "clipnotes", initial: "클", color: "bg-accent2" },
        body: "Meta Pass 설정 확인해보셨어요? 베이크할 때 그것 때문에 새까맣게 나온 적 있어요.",
        createdAt: hoursAgo(20),
      },
      {
        author: { name: "uvjanitor", initial: "U", color: "bg-accent" },
        body: "저도 똑같은 문제 겪었는데 결국 Lightmapping 전용 pass를 따로 만들어서 해결했어요.",
        createdAt: hoursAgo(10),
      },
      {
        author: { name: "riggybit", initial: "리", color: "bg-accent2" },
        body: "Shader Graph 프리뷰 창에서는 Baked GI 값이 항상 0으로 나와서 헷갈리기 쉬워요. 실제 빌드에서 한번 찍어보세요.",
        createdAt: hoursAgo(6),
      },
      {
        author: { name: "hexlumen", initial: "헥", color: "bg-accent" },
        body: "혹시 라이트맵 UV 채널(UV2)을 별도로 안 만들어두신 건 아니죠? 그것 때문에도 새까맣게 나온 적 있어요.",
        createdAt: hoursAgo(2),
      },
    ],
  },
  {
    slug: "blender-free-rigs",
    category: "블렌더",
    categoryColor: "purple",
    bannerTheme: "rigging",
    title: "애니메이션 연습용으로 쓸만한 무료 리그 추천해주세요",
    excerpt:
      "직접 캐릭터 모델링 안 하고 12원칙 연습부터 해보고 싶어요. 표정 컨트롤 잘 되어있으면 더 좋아요.",
    body: [
      "직접 캐릭터 모델링 안 하고 12원칙 연습부터 해보고 싶어요. 표정 컨트롤 잘 되어있으면 더 좋아요.",
    ],
    tags: ["블렌더", "애니메이션", "리깅"],
    author: { name: "animate_this", initial: "애", color: "bg-accent2" },
    createdAt: daysAgo(1),
    viewCount: 89,
    sampleComments: [
      {
        author: { name: "riggybit", initial: "리", color: "bg-accent2" },
        body: "블렌더 스튜디오에서 무료로 풀은 Sprite Fright 리그 추천드려요!",
        createdAt: hoursAgo(6),
      },
    ],
  },
  {
    slug: "blender-geo-nodes-building",
    category: "블렌더",
    categoryColor: "purple",
    bannerTheme: "blender",
    title: "지오메트리 노드로 절차적 건물 만드는 중인데 창문 배치가 이상해요",
    excerpt:
      "Distribute Points On Faces로 창문을 심었는데 모서리 쪽에 겹쳐서 튀어나와요. 배열 노드로 바꿔야 할까요?",
    body: [
      "Distribute Points On Faces로 창문을 심었는데 모서리 쪽에 겹쳐서 튀어나와요. 배열 노드로 바꿔야 할까요?",
      "건물 절차적 생성 튜토리얼을 찾아봐도 다들 조금씩 방식이 달라서 정석이 뭔지 감이 안 잡히네요.",
    ],
    tags: ["블렌더", "지오메트리노드", "절차적생성"],
    author: { name: "mira_renders", initial: "미", color: "bg-accent2" },
    createdAt: hoursAgo(3),
    viewCount: 156,
    sampleComments: [
      {
        author: { name: "nodewrangler", initial: "노", color: "bg-peach" },
        body: "Distribute Points 대신 Instance on Points + Raycast로 모서리 걸러내는 방법도 있어요.",
        createdAt: hoursAgo(2),
      },
      {
        author: { name: "clipnotes", initial: "클", color: "bg-accent2" },
        body: "창문 사이 최소 거리 조건을 노드에 추가하면 겹침이 줄어들 거예요.",
        createdAt: hoursAgo(1),
      },
    ],
  },
  {
    slug: "unity-addressables-memory",
    category: "유니티",
    categoryColor: "blue",
    bannerTheme: "unity",
    title: "어드레서블 처음 쓰는데 씬 전환마다 메모리가 계속 늘어나요",
    excerpt:
      "Addressables.Release를 호출하고 있는데도 프로파일러에서 메모리가 안 떨어져요. 핸들 관리를 잘못하고 있는 걸까요?",
    body: [
      "Addressables.Release를 호출하고 있는데도 프로파일러에서 메모리가 안 떨어져요. 핸들 관리를 잘못하고 있는 걸까요?",
      "AsyncOperationHandle을 리스트에 담아뒀다가 씬 나갈 때 전부 Release 해주는 식으로 하고 있는데, 혹시 흔한 실수가 있다면 알려주세요.",
    ],
    tags: ["유니티", "어드레서블", "메모리"],
    author: { name: "kdev_unity", initial: "케", color: "bg-accent" },
    createdAt: hoursAgo(8),
    viewCount: 274,
    sampleComments: [
      {
        author: { name: "soundscape_yu", initial: "사", color: "bg-muted" },
        body: "핸들을 Dictionary로 관리하면서 씬 전환마다 정확히 짝 맞춰서 Release 해주시나요?",
        createdAt: hoursAgo(6),
      },
      {
        author: { name: "hexlumen", initial: "헥", color: "bg-accent" },
        body: "Addressables 프로파일러 창 켜서 어떤 에셋이 안 풀리는지 직접 확인해보세요.",
        createdAt: hoursAgo(2),
      },
      {
        author: { name: "uvjanitor", initial: "U", color: "bg-accent" },
        body: "혹시 Instantiate까지 Addressables로 하고 계신가요? Instantiate/ReleaseInstance 짝을 안 맞추면 딱 그 증상이 나요.",
        createdAt: hoursAgo(1),
      },
    ],
  },
  {
    slug: "vfx-snow-particle-fps",
    category: "이펙트",
    categoryColor: "peach",
    bannerTheme: "vfx",
    title: "VFX 그래프로 눈 내리는 이펙트 만들었는데 프레임 드랍이 심해요",
    excerpt:
      "파티클 수를 줄여도 GPU 파티클이라 그런지 큰 차이가 없어요. 서브 이미터 때문일까요?",
    body: [
      "파티클 수를 줄여도 GPU 파티클이라 그런지 큰 차이가 없어요. 서브 이미터 때문일까요?",
      "눈송이가 지면에 닿을 때 작은 스파클을 추가로 뿌리는 서브 이미터를 넣었는데, 이걸 빼면 좀 나아지긴 하더라고요. 최적화 팁 있으면 공유해주세요.",
    ],
    tags: ["유니티", "VFX그래프", "최적화"],
    author: { name: "jvfx", initial: "제", color: "bg-muted" },
    createdAt: daysAgo(2),
    viewCount: 198,
    sampleComments: [
      {
        author: { name: "clipnotes", initial: "클", color: "bg-accent2" },
        body: "서브 이미터가 파티클마다 새로 스폰되는 구조면 진짜 무거워요, 확률 기반으로 줄여보세요.",
        createdAt: daysAgo(1.5),
      },
    ],
  },
  {
    slug: "blender-team-collab",
    category: "블렌더",
    categoryColor: "purple",
    bannerTheme: "team",
    title: "여러 명이서 블렌더 파일 같이 작업할 때 다들 어떻게 하세요?",
    excerpt:
      ".blend 파일이 너무 커서 깃으로 버전 관리하기가 힘드네요. 다른 분들은 협업할 때 어떤 방식 쓰시는지 궁금해요.",
    body: [
      ".blend 파일이 너무 커서 깃으로 버전 관리하기가 힘드네요. 다른 분들은 협업할 때 어떤 방식 쓰시는지 궁금해요.",
      "Git LFS를 써야 하나 고민 중인데, 씬을 나눠서 링크로 관리하는 게 나을지도 궁금합니다.",
    ],
    tags: ["블렌더", "협업", "버전관리"],
    author: { name: "animate_this", initial: "애", color: "bg-accent2" },
    createdAt: daysAgo(4),
    viewCount: 233,
    sampleComments: [
      {
        author: { name: "nodewrangler", initial: "노", color: "bg-peach" },
        body: "저희 팀은 씬을 캐릭터/배경으로 나눠서 링크로 관리해요, 병합 충돌이 훨씬 줄어요.",
        createdAt: daysAgo(3),
      },
      {
        author: { name: "soundscape_yu", initial: "사", color: "bg-muted" },
        body: "Git LFS 쓰고 있는데 용량 문제만 빼면 나쁘지 않아요.",
        createdAt: daysAgo(1),
      },
      {
        author: { name: "riggybit", initial: "리", color: "bg-accent2" },
        body: "인원이 적으면 그냥 작업 순서를 정해서 순차적으로 파일 넘기는 것도 의외로 편해요.",
        createdAt: hoursAgo(20),
      },
    ],
  },
];

export const samplePosts: SamplePost[] = RAW_POSTS.map((post) => ({
  ...post,
  comments: post.sampleComments.length,
}));

export type SampleAsset = (typeof featuredAssets)[number];

export const featuredAssets = [
  {
    slug: "low-poly-forest-kit",
    title: "로우폴리 숲 에셋 키트",
    description:
      "나무, 바위, 덤불로 구성된 로우폴리 숲 에셋 모음이에요. 모바일 게임에서도 가볍게 돌아가도록 폴리곤 수를 최소화했어요.",
    author: "terra_props",
    bannerTheme: "blender" as BannerTheme,
    category: "모델",
    license: "CC-BY",
    licenseColor: "bg-blue",
    downloads: "1.2k",
    createdAt: daysAgo(3),
    viewCount: 4800,
  },
  {
    slug: "hand-painted-pbr-rock",
    title: "손으로 그린 PBR 바위 텍스처",
    description:
      "손으로 직접 그린 스타일라이즈드 바위 텍스처예요. Base Color, Normal, Roughness 맵이 포함되어 있어요.",
    author: "stoneworks",
    bannerTheme: "asset" as BannerTheme,
    category: "텍스처",
    license: "CC0",
    licenseColor: "bg-pink",
    downloads: "843",
    createdAt: daysAgo(6),
    viewCount: 2600,
  },
  {
    slug: "toon-shader-urp",
    title: "툰 셰이더 (URP)",
    description:
      "URP 기반 카툰풍 셰이더예요. 림 라이트와 계단식 셰이딩을 파라미터로 조절할 수 있어요.",
    author: "shadyshaders",
    bannerTheme: "shader" as BannerTheme,
    category: "셰이더",
    license: "MIT",
    licenseColor: "bg-purple",
    downloads: "2.4k",
    createdAt: daysAgo(2),
    viewCount: 7100,
  },
  {
    slug: "biped-animation-rig",
    title: "2족 보행 애니메이션 리그",
    description:
      "휴머노이드 캐릭터용 2족 보행 리그예요. IK 컨트롤과 기본 걷기/뛰기 애니메이션이 포함돼 있어요.",
    author: "animate_this",
    bannerTheme: "rigging" as BannerTheme,
    category: "리그",
    license: "CC-BY",
    licenseColor: "bg-mint",
    downloads: "967",
    createdAt: daysAgo(9),
    viewCount: 3100,
  },
  {
    slug: "scifi-corridor-props",
    title: "SF 복도 소품 세트",
    description:
      "SF 우주선/기지 복도를 꾸밀 수 있는 소품 세트예요. 파이프, 패널, 조명 등 20종이 들어있어요.",
    author: "voidkit",
    bannerTheme: "asset" as BannerTheme,
    category: "모델",
    license: "CC0",
    licenseColor: "bg-blue",
    downloads: "612",
    createdAt: daysAgo(12),
    viewCount: 1900,
  },
  {
    slug: "footstep-impact-sfx-pack",
    title: "발소리·충격 효과음 팩",
    description:
      "표면별 발소리와 충격음 효과음 팩이에요. 흙, 나무, 금속, 물 등 다양한 표면 소리가 들어있어요.",
    author: "audiobits",
    bannerTheme: "vfx" as BannerTheme,
    category: "사운드",
    license: "CC-BY",
    licenseColor: "bg-peach",
    downloads: "1.5k",
    createdAt: daysAgo(5),
    viewCount: 4300,
  },
  {
    slug: "stylized-water-shader",
    title: "스타일라이즈드 물 셰이더",
    description:
      "파도, 거품, 굴절이 표현되는 스타일라이즈드 물 셰이더예요. 색상과 파도 속도를 자유롭게 조절할 수 있어요.",
    author: "shadyshaders",
    bannerTheme: "shader" as BannerTheme,
    category: "셰이더",
    license: "MIT",
    licenseColor: "bg-purple",
    downloads: "3.1k",
    createdAt: daysAgo(1),
    viewCount: 8900,
  },
  {
    slug: "hand-drawn-ui-icon-set",
    title: "손그림 UI 아이콘 세트",
    description:
      "손그림 느낌의 UI 아이콘 120종 세트예요. 인벤토리, 상태 아이콘 등 게임 UI 전반에 쓸 수 있어요.",
    author: "inkwell",
    bannerTheme: "asset" as BannerTheme,
    category: "텍스처",
    license: "CC-BY",
    licenseColor: "bg-blue",
    downloads: "2.0k",
    createdAt: daysAgo(7),
    viewCount: 5600,
  },
];

export type SampleProject = (typeof sampleProjects)[number];

export const sampleProjects = [
  {
    slug: "roguelike-dungeon-crawler",
    status: "모집중" as const,
    category: "유니티",
    categoryColor: "bg-blue",
    bannerTheme: "unity" as BannerTheme,
    title: "로그라이크 던전 크롤러 - 3D 모델러 구해요",
    description:
      "둘이서 진행 중인 소규모 프로젝트예요. 로우폴리 던전 타일셋과 몬스터 모델링 해주실 분을 찾고 있어요. 주 5시간 정도 투자 가능하신 분이면 좋겠어요.",
    role: "3D 모델러 구인",
    team: "팀원 2명",
    author: { name: "kdev_unity", initial: "케", color: "bg-accent2" },
    createdAt: daysAgo(3),
    viewCount: 412,
  },
  {
    slug: "short-film-rigging-artist",
    status: "모집중" as const,
    category: "블렌더",
    categoryColor: "bg-purple",
    bannerTheme: "blender" as BannerTheme,
    title: "단편 애니메이션 <도시의 밤> - 리깅 아티스트 모집",
    description:
      "3분짜리 단편 애니메이션을 만들고 있어요. 캐릭터 2명 리깅해주실 분이 필요합니다. 완성 후 크레딧에 이름 올려드려요.",
    role: "리깅 아티스트 구인",
    team: "팀원 4명",
    author: { name: "mira_renders", initial: "미", color: "bg-accent" },
    createdAt: daysAgo(6),
    viewCount: 287,
  },
  {
    slug: "echo-room-co-op-puzzle",
    status: "진행중" as const,
    category: "유니티",
    categoryColor: "bg-blue",
    bannerTheme: "team" as BannerTheme,
    title: "협동 퍼즐 게임 <에코 룸> - 사운드 디자이너와 함께 마무리 중",
    description:
      "팀 4명이서 출시 준비 중인 프로젝트예요. 현재는 추가 모집 없이 마무리 작업 중입니다.",
    role: "모집 마감",
    team: "팀원 4명",
    author: { name: "jvfx", initial: "제", color: "bg-muted" },
    createdAt: daysAgo(10),
    viewCount: 651,
  },
];

export const blogPosts = [
  {
    slug: "solo-indie-dev-one-year",
    tag: "개발기",
    title: "혼자서 인디 게임 1년 만들어본 후기",
    excerpt:
      "기획부터 스팀 출시까지, 유니티로 혼자 개발하면서 겪은 시행착오들을 정리해봤어요.",
    body: [
      "기획부터 스팀 출시까지, 유니티로 혼자 개발하면서 겪은 시행착오들을 정리해봤어요. 처음 6개월은 거의 기획만 계속 뒤엎었던 것 같아요 — 재미있어 보이는 아이디어와 실제로 완성 가능한 범위 사이의 간극을 몸으로 배웠습니다.",
      "가장 크게 후회하는 건 프로토타입 단계에서 아트를 너무 일찍 다듬기 시작한 거예요. 재미가 검증되지 않은 시스템에 시간을 쏟았다가 결국 갈아엎은 부분이 많았어요. 다음 프로젝트에서는 회색 박스로 재미부터 확인하고 나서 아트에 들어갈 생각이에요.",
      "그래도 혼자 만든 게임을 실제로 스팀에 올리고 몇 명이라도 플레이해주는 걸 보니 확실히 뿌듯하더라고요. 궁금하신 점 있으면 댓글로 물어봐주세요.",
    ],
    author: "kdev_unity",
    initial: "케",
    color: "bg-accent",
    readTime: "5분 소요",
    createdAt: daysAgo(2),
    viewCount: 1840,
  },
  {
    slug: "geometry-nodes-procedural-tree",
    tag: "튜토리얼",
    title: "블렌더 지오메트리 노드로 절차적 나무 만들기",
    excerpt:
      "노드 세팅 스크린샷과 함께 처음부터 끝까지 따라 할 수 있게 정리했어요.",
    body: [
      "노드 세팅 스크린샷과 함께 처음부터 끝까지 따라 할 수 있게 정리했어요. 기본 아이디어는 Curve to Mesh로 줄기를 만들고, Distribute Points로 가지를 심은 다음 재귀적으로 인스턴스를 쌓아가는 방식이에요.",
      "핵심은 줄기 두께를 뿌리에서 끝으로 갈수록 줄여주는 Spline Parameter 활용이랑, 가지 방향에 랜덤을 얼마나 섞을지 조절하는 노이즈 강도예요. 너무 랜덤하면 나무가 아니라 덤불처럼 보이더라고요.",
      "잎사귀는 별도 인스턴스 컬렉션으로 분리해서 밀도만 슬라이더로 조절할 수 있게 해뒀어요. 노드 그룹으로 한번 만들어두면 다음부터는 파라미터만 바꿔서 다양한 나무를 빠르게 뽑아낼 수 있습니다.",
    ],
    author: "mira_renders",
    initial: "미",
    color: "bg-accent2",
    readTime: "8분 소요",
    createdAt: daysAgo(5),
    viewCount: 3210,
  },
  {
    slug: "urp-performance-mistakes",
    tag: "팁",
    title: "URP 성능 잡아먹는 흔한 실수 5가지",
    excerpt:
      "드로우콜부터 셰이더까지, URP에서 자주 놓치는 성능 병목 5가지를 정리했어요.",
    body: [
      "드로우콜부터 셰이더까지, URP에서 자주 놓치는 성능 병목 5가지를 정리했어요.",
      "1) 머티리얼을 인스턴스별로 살짝씩 바꿔서 SRP Batcher가 깨지는 경우가 생각보다 많아요. 2) 실시간 그림자를 켠 라이트 개수가 쌓이면 모바일에서 특히 치명적이에요. 3) 후처리 볼륨을 씬마다 새로 만들면 불필요한 오버헤드가 생겨요.",
      "4) 셰이더 그래프에서 조건 분기를 남발하면 GPU에서는 사실상 양쪽 다 계산하는 경우가 많다는 것도 잘 안 알려져 있어요. 5) 텍스처 압축 설정을 플랫폼별로 안 나눠두면 빌드 용량과 대역폭에서 손해를 보게 됩니다.",
      "프로파일러로 하나씩 찍어보면서 확인한 내용이니 참고하시면 좋을 것 같아요.",
    ],
    author: "shadyshaders",
    initial: "셰",
    color: "bg-peach",
    readTime: "6분 소요",
    createdAt: daysAgo(8),
    viewCount: 2470,
  },
  {
    slug: "git-conflict-free-team-workflow",
    tag: "개발기",
    title: "팀 프로젝트에서 깃 충돌 안 나게 작업 나누는 법",
    excerpt: "씬 파일 충돌 없이 여러 명이 같이 작업하는 방법을 정리했어요.",
    body: [
      "씬 파일 충돌 없이 여러 명이 같이 작업하는 방법을 정리했어요. 가장 확실한 건 씬을 기능 단위로 잘게 쪼개서 각자 다른 씬/프리팹을 작업하고, 메인 씬에서는 참조만 하는 구조예요.",
      "프리팹 병합은 유니티 자체 Smart Merge 도구를 붙여두면 텍스트 diff보다 충돌이 훨씬 덜 생겨요. 그리고 한 명이 공용 프리팹을 건드릴 때는 미리 채널에 공지하는 규칙만 지켜도 사고가 크게 줄었습니다.",
      "결국 도구보다는 '누가 언제 뭘 건드리는지' 소통이 제일 중요하다는 걸 다시 느꼈어요.",
    ],
    author: "jvfx",
    initial: "제",
    color: "bg-muted",
    readTime: "4분 소요",
    createdAt: daysAgo(11),
    viewCount: 1520,
  },
];

export const codeSnippets = [
  {
    language: "C#",
    languageColor: "bg-blue",
    title: "오브젝트 풀링 간단 구현",
    likes: 42,
    copies: 0,
    filename: undefined,
    content: `public class ObjectPool<T> where T : Component
{
  // 큐에서 꺼내 쓰고 없으면 새로 생성
  Queue<T> pool = new Queue<T>();
  public T Get() => pool.Count > 0 ? pool.Dequeue() : Object.Instantiate(prefab);
}`,
    author: { name: "kdev_unity", initial: "케", color: "bg-accent" },
    createdAt: daysAgo(4),
    viewCount: 960,
  },
  {
    language: "HLSL",
    languageColor: "bg-mint",
    title: "간단한 Fresnel 림 라이트 함수",
    likes: 67,
    copies: 0,
    filename: undefined,
    content: `float Fresnel(float3 normal, float3 viewDir, float power)
{
  return pow(1.0 - saturate(dot(normal, viewDir)), power);
}`,
    author: { name: "shadyshaders", initial: "셰", color: "bg-peach" },
    createdAt: daysAgo(9),
    viewCount: 1340,
  },
];
