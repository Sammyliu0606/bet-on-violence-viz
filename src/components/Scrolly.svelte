<!-- Set up scrollama, listens for step changes, broadcast the current step number -->

<script>
    import { onMount, onDestroy } from 'svelte';
    import scrollama from 'scrollama';

    export let currentStep = 0; // App.svelte bind to this to get current step number
    export let offset = 0.5; // tell scrollma when .step element cross halfway point of the creen, scrollma filres

    let scroller;

    onMount(() => {
        scroller = scrollama();
        scroller
            .setup({
                step: '.step', // look for elements with class .step as the trigger points
                offset: offset,
                debug: false,
            })
            .onStepEnter(({ index }) => { // when a .step element enters the trigger point, update currentStep to the index of that step
                currentStep = index;
            });

            window.addEventListener('resize', scroller.resize); // when users resize the window, tell scrollama to recalculate the trigger points
    });

    onDestroy(() => { // tell scrollma to stop listening and clean up
        if (scroller) scroller.destroy();
        window.removeEventListener('resize', scroller.resize);
    });

</script>

<slot />