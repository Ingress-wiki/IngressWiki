<script lang="ts">
  export type IngressLevel =
    | 1
    | 2
    | 3
    | 4
    | 5
    | 6
    | 7
    | 8
    | 9
    | 10
    | 11
    | 12
    | 13
    | 14
    | 15
    | 16;

  const { l }: { l: IngressLevel } = $props();

  function levelColorFor(level: IngressLevel): string {
    const colorOneToSeven = [
      "#f0ff20",
      "#ffb01c",
      "#ff8733",
      "#ff632c",
      "#c80431",
      "#ff0e82",
      "#b400ff",
    ];
    return colorOneToSeven[level - 1] ?? "#5200ff";
  }

  const levelColor = levelColorFor(l);
</script>

<span class="font-exo font-semibold px-0.5 inline-block">
  <span class="font-bold" style:color={levelColor}>L</span><span
    class="opacity-90">{l}</span
  >
</span>
