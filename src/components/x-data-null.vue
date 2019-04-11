<template>
	<div class="x-tc x-tc-qhui x-ptb-40">
		<mu-icon value=":fa fa-frown-o" size="80"></mu-icon>
		<div>
			{{text}}
		</div>
	</div>
</template>

<script>
    export default {
        props: {
            text: String
        }
    }
</script>
<style>
</style>
