// Placeholder content for the UI-only phase, matching the approved mockups.
// Replace with real Prisma queries once posts/assets/projects are wired to the database.

export type SamplePost = {
  slug: string;
  category: string;
  categoryColor: "pink" | "purple" | "blue" | "mint" | "peach";
  title: string;
  excerpt: string;
  body: string[];
  code?: { filename: string; content: string };
  tags: string[];
  author: { name: string; initial: string; color: string };
  time: string;
  comments: number;
};

export const samplePosts: SamplePost[] = [
  {
    slug: "blender-uv-seam",
    category: "블렌더",
    categoryColor: "purple",
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
    time: "2시간 전",
    comments: 8,
  },
  {
    slug: "unity-nullreference-prefab",
    category: "유니티",
    categoryColor: "blue",
    title: "런타임에 프리팹 생성할 때 NullReferenceException이 계속 떠요",
    excerpt:
      "에디터에서는 잘 되는데 빌드하면 바로 터져요. ScriptableObject 로드 순서 문제인 것 같아요.",
    body: [
      "에디터에서는 잘 되는데 빌드하면 바로 터져요. ScriptableObject 로드 순서 문제인 것 같은데 정확히 어디서 꼬이는지 못 찾겠어요.",
      "혹시 비슷한 문제 겪어보신 분 있을까요?",
    ],
    tags: ["유니티", "프리팹", "C#"],
    author: { name: "kdev_unity", initial: "케", color: "bg-accent" },
    time: "5시간 전",
    comments: 14,
  },
  {
    slug: "urp-shader-lighting-bake",
    category: "셰이더",
    categoryColor: "mint",
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
    time: "1일 전",
    comments: 12,
  },
  {
    slug: "blender-free-rigs",
    category: "블렌더",
    categoryColor: "purple",
    title: "애니메이션 연습용으로 쓸만한 무료 리그 추천해주세요",
    excerpt:
      "직접 캐릭터 모델링 안 하고 12원칙 연습부터 해보고 싶어요. 표정 컨트롤 잘 되어있으면 더 좋아요.",
    body: [
      "직접 캐릭터 모델링 안 하고 12원칙 연습부터 해보고 싶어요. 표정 컨트롤 잘 되어있으면 더 좋아요.",
    ],
    tags: ["블렌더", "애니메이션", "리깅"],
    author: { name: "animate_this", initial: "애", color: "bg-accent2" },
    time: "1일 전",
    comments: 21,
  },
];

export const featuredAssets = [
  {
    title: "로우폴리 숲 에셋 키트",
    author: "terra_props",
    color: "bg-purple",
    license: "CC-BY",
    licenseColor: "bg-blue",
    downloads: "1.2k",
  },
  {
    title: "손으로 그린 PBR 바위 텍스처",
    author: "stoneworks",
    color: "bg-mint",
    license: "CC0",
    licenseColor: "bg-pink",
    downloads: "843",
  },
  {
    title: "툰 셰이더 (URP)",
    author: "shadyshaders",
    color: "bg-peach",
    license: "MIT",
    licenseColor: "bg-purple",
    downloads: "2.4k",
  },
  {
    title: "2족 보행 애니메이션 리그",
    author: "animate_this",
    color: "bg-blue",
    license: "CC-BY",
    licenseColor: "bg-mint",
    downloads: "967",
  },
  {
    title: "SF 복도 소품 세트",
    author: "voidkit",
    color: "bg-pink",
    license: "CC0",
    licenseColor: "bg-blue",
    downloads: "612",
  },
  {
    title: "발소리·충격 효과음 팩",
    author: "audiobits",
    color: "bg-mint",
    license: "CC-BY",
    licenseColor: "bg-peach",
    downloads: "1.5k",
  },
  {
    title: "스타일라이즈드 물 셰이더",
    author: "shadyshaders",
    color: "bg-purple",
    license: "MIT",
    licenseColor: "bg-purple",
    downloads: "3.1k",
  },
  {
    title: "손그림 UI 아이콘 세트",
    author: "inkwell",
    color: "bg-peach",
    license: "CC-BY",
    licenseColor: "bg-blue",
    downloads: "2.0k",
  },
];

export const sampleProjects = [
  {
    status: "모집중" as const,
    category: "유니티",
    categoryColor: "bg-blue",
    title: "로그라이크 던전 크롤러 - 3D 모델러 구해요",
    description:
      "둘이서 진행 중인 소규모 프로젝트예요. 로우폴리 던전 타일셋과 몬스터 모델링 해주실 분을 찾고 있어요. 주 5시간 정도 투자 가능하신 분이면 좋겠어요.",
    role: "3D 모델러 구인",
    team: "팀원 2명",
    author: { name: "kdev_unity", initial: "케", color: "bg-accent2" },
  },
  {
    status: "모집중" as const,
    category: "블렌더",
    categoryColor: "bg-purple",
    title: "단편 애니메이션 <도시의 밤> - 리깅 아티스트 모집",
    description:
      "3분짜리 단편 애니메이션을 만들고 있어요. 캐릭터 2명 리깅해주실 분이 필요합니다. 완성 후 크레딧에 이름 올려드려요.",
    role: "리깅 아티스트 구인",
    team: "팀원 4명",
    author: { name: "mira_renders", initial: "미", color: "bg-accent" },
  },
  {
    status: "진행중" as const,
    category: "유니티",
    categoryColor: "bg-blue",
    title: "협동 퍼즐 게임 <에코 룸> - 사운드 디자이너와 함께 마무리 중",
    description:
      "팀 4명이서 출시 준비 중인 프로젝트예요. 현재는 추가 모집 없이 마무리 작업 중입니다.",
    role: "모집 마감",
    team: "팀원 4명",
    author: { name: "jvfx", initial: "제", color: "bg-muted" },
  },
];

export const blogPosts = [
  {
    tag: "개발기",
    title: "혼자서 인디 게임 1년 만들어본 후기",
    excerpt:
      "기획부터 스팀 출시까지, 유니티로 혼자 개발하면서 겪은 시행착오들을 정리해봤어요.",
    author: "kdev_unity",
    initial: "케",
    color: "bg-accent",
    readTime: "5분 소요",
  },
  {
    tag: "튜토리얼",
    title: "블렌더 지오메트리 노드로 절차적 나무 만들기",
    excerpt:
      "노드 세팅 스크린샷과 함께 처음부터 끝까지 따라 할 수 있게 정리했어요.",
    author: "mira_renders",
    initial: "미",
    color: "bg-accent2",
    readTime: "8분 소요",
  },
];

export const codeSnippets = [
  {
    language: "C#",
    languageColor: "bg-blue",
    title: "오브젝트 풀링 간단 구현",
    likes: 42,
    copies: 128,
    filename: undefined,
    content: `public class ObjectPool<T> where T : Component
{
  // 큐에서 꺼내 쓰고 없으면 새로 생성
  Queue<T> pool = new Queue<T>();
  public T Get() => pool.Count > 0 ? pool.Dequeue() : Object.Instantiate(prefab);
}`,
    author: { name: "kdev_unity", initial: "케", color: "bg-accent" },
  },
  {
    language: "HLSL",
    languageColor: "bg-mint",
    title: "간단한 Fresnel 림 라이트 함수",
    likes: 67,
    copies: 203,
    filename: undefined,
    content: `float Fresnel(float3 normal, float3 viewDir, float power)
{
  return pow(1.0 - saturate(dot(normal, viewDir)), power);
}`,
    author: { name: "shadyshaders", initial: "셰", color: "bg-peach" },
  },
];
